"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ArrowRight, Check, Sparkles, AlertCircle, Tag } from "lucide-react";
import { PACKAGES, formatPrice, formatDiscountedPrice, getDiscountedPrice, validateCoupon, type PackageDefinition, type CurrencyCode } from "@/lib/pricing";
import { useCurrency, setGlobalCurrency } from "@/lib/useCurrency";

const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -24 : 24, transition: { duration: 0.2 } }),
};

interface Slot {
  id: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isBooked: boolean;
}

const TIMEZONES = [
  { value: "America/Los_Angeles", label: "US Pacific Time (PST/PDT)" },
  { value: "America/Denver", label: "US Mountain Time (MST/MDT)" },
  { value: "America/Chicago", label: "US Central Time (CST/CDT)" },
  { value: "America/New_York", label: "US Eastern Time (EST/EDT)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "GMT", label: "Greenwich Mean Time (GMT / UTC)" },
  { value: "Europe/London", label: "London Time (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European Time (CET/CEST)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

export default function BookingWidget() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const changeStep = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };
  // Currency is auto-detected from the visitor's locale/timezone (India -> INR, Canada -> CAD,
  // else USD) and shared with the homepage via useCurrency — no manual selector.
  const currency = useCurrency();
  const [selectedPackage, setSelectedPackage] = useState<PackageDefinition>(PACKAGES[0]);

  // Slots fetched from the API
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  // Timezone selection state
  const [selectedTimezone, setSelectedTimezone] = useState<string>("America/Los_Angeles");

  // Personal & Birth details states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    gender: "Male",
    notes: "",
  });

  // City verification/autocomplete states
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);
  const [cityValid, setCityValid] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Coupon code states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [couponStatus, setCouponStatus] = useState<{ success?: string; error?: string }>({});

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const coupon = validateCoupon(couponInput);
    if (coupon) {
      setAppliedCoupon(coupon.code);
      setCouponStatus({ success: `${coupon.description}` });
      setPaypalOrder(null);
    } else {
      setAppliedCoupon("");
      setCouponStatus({ error: "Invalid promo / coupon code." });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponInput("");
    setCouponStatus({});
    setPaypalOrder(null);
  };

  // PayPal checkout state (USD/CAD route through PayPal since Razorpay only settles INR here)
  const [paypalOrder, setPaypalOrder] = useState<{ orderId: string; clientId: string; currency: CurrencyCode } | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement | null>(null);

  // Fetch slots from API, dynamic based on selected package duration & buffer
  useEffect(() => {
    async function getSlots() {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/slots?packageId=${selectedPackage.id}`);
        const data = await res.json();
        if (data.success) {
          setSlots(data.slots);
        } else {
          setErrorMessage(data.error || "Failed to load slots.");
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setErrorMessage("Connection error loading slots.");
      } finally {
        setLoadingSlots(false);
      }
    }
    getSlots();
  }, [selectedPackage]);

  // Listen to custom dispatch events from page package buttons
  useEffect(() => {
    const handlePackageSelection = (e: Event) => {
      const customEvent = e as CustomEvent;
      const pkgId = customEvent.detail;
      const pkg = PACKAGES.find((p) => p.id === pkgId);
      if (pkg) {
        setSelectedPackage(pkg);
        changeStep(1); // Jump to choose package first
      }
    };

    window.addEventListener("select-package", handlePackageSelection);
    return () => {
      window.removeEventListener("select-package", handlePackageSelection);
    };
  }, []);

  const defaultTimezoneForCurrency = (c: CurrencyCode) => {
    if (c === "INR") return "Asia/Kolkata";
    if (c === "CAD") return "America/Toronto";
    return "America/Los_Angeles";
  };

  // Detect the visitor's actual timezone for the schedule view, falling back to the
  // detected currency's regional default if the browser doesn't report one.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setSelectedTimezone(detectedTz || defaultTimezoneForCurrency(currency));
    } catch (e) {
      console.warn("Browser timezone auto-detection failed.");
    }
  }, [currency]);

  // Reset selected date/slot when timezone selection changes
  useEffect(() => {
    setSelectedDate(null);
    setSelectedSlotId("");
  }, [selectedTimezone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // City autocomplete handler using OpenStreetMap Nominatim API
  const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, birthPlace: val }));
    setCityValid(false);

    if (val.trim().length > 2) {
      setSearchingCity(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&addressdetails=1`,
          {
            headers: {
              "User-Agent": "AstroShubham-Booking-App",
            },
          }
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          const suggestions = data.map((item: any) => item.display_name);
          setCitySuggestions(suggestions);
        }
      } catch (err) {
        console.error("Error fetching city suggestions:", err);
      } finally {
        setSearchingCity(false);
      }
    } else {
      setCitySuggestions([]);
    }
  };

  const handleSelectCity = (city: string) => {
    setFormData((prev) => ({ ...prev, birthPlace: city }));
    setCitySuggestions([]);
    setCityValid(true);
  };

  const selectPackageById = (id: string) => {
    const pkg = PACKAGES.find((p) => p.id === id);
    if (pkg) {
      setSelectedPackage(pkg);
    }
  };

  const getTargetTimezone = () => {
    return selectedTimezone;
  };

  const getTimezoneLabel = () => {
    const tzObj = getDropdownTimezones().find((t) => t.value === selectedTimezone);
    return tzObj ? tzObj.label : selectedTimezone;
  };

  // Helper to dynamically build the timezone select options, including the visitor's local zone if not present
  const getDropdownTimezones = () => {
    const list = [...TIMEZONES];
    if (selectedTimezone && !list.some((tz) => tz.value === selectedTimezone)) {
      list.push({ value: selectedTimezone, label: `Local: ${selectedTimezone}` });
    }
    return list;
  };

  // Group unique dates from future unbooked slots based on the plan's timezone view
  const getAvailableDates = () => {
    const datesMap: Record<string, Date> = {};
    const tz = getTargetTimezone();
    slots.forEach((slot) => {
      const d = new Date(slot.startTime);
      const tzDateStr = d.toLocaleDateString("en-US", { timeZone: tz });
      if (!datesMap[tzDateStr]) {
        datesMap[tzDateStr] = d;
      }
    });
    return Object.values(datesMap).sort((a, b) => a.getTime() - b.getTime());
  };

  const availableDates = getAvailableDates();

  // Get slots for the selected date based on the plan's timezone view
  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    const tz = getTargetTimezone();
    const selectedTzDateStr = selectedDate.toLocaleDateString("en-US", { timeZone: tz });
    return slots.filter((slot) => {
      const d = new Date(slot.startTime);
      return d.toLocaleDateString("en-US", { timeZone: tz }) === selectedTzDateStr;
    });
  };

  const activeSlots = getSlotsForSelectedDate();

  const handleNextStep = () => {
    if (step === 1) {
      changeStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedSlotId) {
        alert("Please select both a Date and a Time slot.");
        return;
      }
      changeStep(3);
    } else if (step === 3) {
      if (!formData.name || !formData.email || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
        alert("Please fill in all mandatory birth details.");
        return;
      }

      // City validation check
      const hasComma = formData.birthPlace.includes(",");
      const isWordCountValid = formData.birthPlace.split(" ").filter((w) => w.trim().length > 1).length >= 2;
      
      if (!cityValid && (!hasComma || !isWordCountValid)) {
        alert("Please select a verified city from the list or format your entry as: 'City, Country' (e.g. New York, US).");
        return;
      }

      changeStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      changeStep(step - 1);
    }
  };

  const loadRazorpaySDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setPaypalOrder(null);

    try {
      // Razorpay's checkout.js is only needed for the INR flow
      if (currency === "INR") {
        const isSDKLoaded = await loadRazorpaySDK();
        if (!isSDKLoaded) {
          setErrorMessage("Failed to load payment processor. Please check your internet connection.");
          setSubmitting(false);
          return;
        }
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          timeSlotId: selectedSlotId,
          currency,
          couponCode: appliedCoupon || undefined,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Booking submission failed.");
        setSubmitting(false);
        return;
      }

      // USD/CAD route through PayPal: the booking/order is created, now render the actual
      // PayPal button below for the customer to complete payment on PayPal's own UI.
      if (data.provider === "paypal") {
        setPaypalOrder({ orderId: data.paypalOrderId, clientId: data.paypalClientId, currency });
        setSubmitting(false);
        return;
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: "AstroShubham",
        description: selectedPackage.title,
        order_id: data.razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#ffffff",
        },
        handler: async function (response: any) {
          setSubmitting(true);
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              changeStep(5); // Success step!
            } else {
              setErrorMessage(verifyData.error || "Payment validation failed.");
            }
          } catch (err) {
            console.error("Signature verification error:", err);
            setErrorMessage("Error verifying payment transaction.");
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Error in submission flow:", err);
      setErrorMessage(err.message || "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  // Renders PayPal's own Smart Button once a PayPal order has been created server-side.
  // The script is scoped per client-id/currency combination since both are baked into its URL.
  useEffect(() => {
    if (!paypalOrder || !paypalContainerRef.current) return;
    let cancelled = false;

    const renderButtons = () => {
      if (cancelled || !paypalContainerRef.current) return;
      paypalContainerRef.current.innerHTML = "";
      (window as any).paypal
        .Buttons({
          createOrder: () => paypalOrder.orderId,
          onApprove: async () => {
            setSubmitting(true);
            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paypalOrderId: paypalOrder.orderId }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                changeStep(5);
              } else {
                setErrorMessage(verifyData.error || "Payment validation failed.");
              }
            } catch (err) {
              console.error("PayPal verification error:", err);
              setErrorMessage("Error verifying payment transaction.");
            } finally {
              setSubmitting(false);
            }
          },
          onError: (err: any) => {
            console.error("PayPal Buttons error:", err);
            setErrorMessage("PayPal checkout encountered an error. Please try again.");
          },
        })
        .render(paypalContainerRef.current);
    };

    const scriptId = "paypal-sdk";
    const neededSrc = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalOrder.clientId)}&currency=${paypalOrder.currency}`;
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript && existingScript.src === neededSrc && (window as any).paypal) {
      renderButtons();
    } else {
      existingScript?.remove();
      delete (window as any).paypal;
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = neededSrc;
      script.onload = renderButtons;
      script.onerror = () => setErrorMessage("Failed to load PayPal checkout. Please check your internet connection.");
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [paypalOrder]);

  const getSelectedSlotTimeLabel = () => {
    const slot = slots.find((s) => s.id === selectedSlotId);
    if (!slot) return "";
    const tz = getTargetTimezone();
    const cleanLabel = getTimezoneLabel().includes("(") 
      ? " " + getTimezoneLabel().substring(0, getTimezoneLabel().indexOf(" ("))
      : " " + getTimezoneLabel();
    return (
      new Date(slot.startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: tz,
      }) + cleanLabel
    );
  };

  return (
    <div className="glass-card" style={{ maxWidth: "700px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      {/* Step Indicator */}
      {step <= 4 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2.5rem", position: "relative" }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                cursor: s < step ? "pointer" : "default",
              }}
              onClick={() => s < step && changeStep(s)}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: s === step ? "var(--text-primary)" : "var(--bg-card)",
                  border: `1.5px solid ${s <= step ? "var(--text-primary)" : "var(--border-color)"}`,
                  color: s === step ? "var(--bg-dark)" : "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease",
                }}
              >
                {s < step ? <Check size={16} /> : s}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: s === step ? "var(--text-primary)" : "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s === 1 ? "Plan" : s === 2 ? "Schedule" : s === 3 ? "Details" : "Confirm"}
              </span>
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              top: "18px",
              left: "10%",
              width: "80%",
              height: "1.5px",
              background: "var(--border-color)",
              zIndex: 1,
            }}
          >
            <motion.div
              style={{
                height: "100%",
                background: "var(--text-primary)",
              }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}

      {/* Error Bar */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              padding: "0.8rem 1.2rem",
              borderRadius: "4px",
              color: "#f87171",
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
              overflow: "hidden",
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={direction}>
      {/* Step 1: Choose Package */}
      {step === 1 && (
        <motion.div key="step-1" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.8rem" }}>
            <h3 style={{ margin: 0, color: "var(--text-primary)", fontSize: "1.2rem" }}>Choose Consultation Plan</h3>
            <div style={{ display: "inline-flex", background: "rgba(255, 255, 255, 0.03)", padding: "3px", borderRadius: "6px", border: "1px solid var(--border-color)", gap: "4px" }}>
              {(["INR", "USD", "CAD"] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setGlobalCurrency(c)}
                  style={{
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    background: currency === c ? "var(--gold-primary)" : "transparent",
                    color: currency === c ? "#000" : "var(--text-secondary)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {c === "INR" ? "₹ INR" : c === "USD" ? "$ USD" : "CA$ CAD"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {PACKAGES.map((pkg) => (
              <motion.div
                key={pkg.id}
                onClick={() => selectPackageById(pkg.id)}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  padding: "1.2rem 1.5rem",
                  borderRadius: "var(--border-radius)",
                  border: `1.5px solid ${selectedPackage.id === pkg.id ? "var(--text-primary)" : "var(--border-color)"}`,
                  background: selectedPackage.id === pkg.id ? "rgba(255, 255, 255, 0.02)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1.5rem",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <h4 style={{ fontSize: "1rem", color: "var(--text-primary)" }}>
                    {pkg.title}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "450px" }}>
                    {pkg.description}
                  </p>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Duration: {pkg.duration}</span>
                </div>
                <div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-primary)" }}>
                    {formatPrice(pkg, currency)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Schedule (Date & Time) */}
      {step === 2 && (
        <motion.div key="step-2" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit">
          <h3 style={{ textAlign: "center", marginBottom: "1.8rem", color: "var(--text-primary)" }}>Select Consultation Slot</h3>
          {loadingSlots ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Aligning available cosmic intervals...
            </div>
          ) : availableDates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              No available slots found. Please contact support.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
              {/* Date Selection */}
              <div>
                <label style={{ display: "block", marginBottom: "0.8rem", color: "var(--text-primary)", fontSize: "0.9rem" }}>
                  <CalendarIcon size={14} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
                  Select Date
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                    gap: "0.6rem",
                  }}
                >
                  {availableDates.map((date) => {
                    const tz = getTargetTimezone();
                    const isSelected = selectedDate &&
                      selectedDate.toLocaleDateString("en-US", { timeZone: tz }) === date.toLocaleDateString("en-US", { timeZone: tz });
                    return (
                      <motion.button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedSlotId("");
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn"
                        style={{
                          padding: "0.6rem 0.2rem",
                          flexDirection: "column",
                          background: isSelected ? "var(--text-primary)" : "var(--bg-dark)",
                          color: isSelected ? "var(--bg-dark)" : "var(--text-primary)",
                          border: `1px solid ${isSelected ? "var(--text-primary)" : "rgba(255,255,255,0.05)"}`,
                          borderRadius: "var(--border-radius-sm)",
                        }}
                      >
                        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", opacity: 0.8 }}>
                          {date.toLocaleDateString("en-US", { weekday: "short", timeZone: tz })}
                        </span>
                        <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                          {date.toLocaleDateString("en-US", { day: "numeric", timeZone: tz })}
                        </span>
                        <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>
                          {date.toLocaleDateString("en-US", { month: "short", timeZone: tz })}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div>
                  <label style={{ display: "block", marginBottom: "0.8rem", color: "var(--text-primary)", fontSize: "0.9rem" }}>
                    <Clock size={14} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
                    Select Time
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: "0.6rem",
                    }}
                  >
                    {activeSlots.map((slot) => {
                      const isSelected = selectedSlotId === slot.id;
                      const tz = getTargetTimezone();
                      const timeString = new Date(slot.startTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: tz,
                      });
                      return (
                        <motion.button
                          key={slot.id}
                          onClick={() => setSelectedSlotId(slot.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn"
                          style={{
                            padding: "0.6rem 0.4rem",
                            fontSize: "0.85rem",
                            background: isSelected ? "var(--text-primary)" : "var(--bg-dark)",
                            color: isSelected ? "var(--bg-dark)" : "var(--text-primary)",
                            border: `1px solid ${isSelected ? "var(--text-primary)" : "rgba(255,255,255,0.05)"}`,
                            borderRadius: "var(--border-radius-sm)",
                          }}
                        >
                          {timeString}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Timezone Selector dropdown matching styling in screenshot */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
                <label className="form-label" style={{ display: "block", marginBottom: "0.6rem" }}>
                  Time zone
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center", maxWidth: "400px" }}>
                  <span style={{ position: "absolute", left: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  </span>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    className="form-input"
                    style={{
                      paddingLeft: "2.5rem",
                      fontSize: "0.85rem",
                      background: "rgba(255,255,255,0.01)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {getDropdownTimezones().map((tz) => (
                      <option key={tz.value} value={tz.value} style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          )}
        </motion.div>
      )}

      {/* Step 3: Personal & Birth Details */}
      {step === 3 && (
        <motion.div key="step-3" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="form-container">
          <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "var(--text-primary)" }}>Provide Birth Parameters</h3>
          
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Shubham Chhabra"
            />
          </div>

          {/* Email & Phone */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="shubham@gmail.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="+91 99999 99999"
              />
            </div>
          </div>

          {/* Birth Date & Birth Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Birth Date *</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Birth Time *</label>
              <input
                type="time"
                name="birthTime"
                value={formData.birthTime}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Birth Place & Gender */}
          <div className="form-row">
            <div className="form-group" style={{ position: "relative" }}>
              <label className="form-label">Birth Place * (City, Country)</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleCityChange}
                  required
                  className="form-input"
                  placeholder="New York, US"
                  autoComplete="off"
                />
                {searchingCity && (
                  <span style={{ position: "absolute", right: "1rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Verifying...
                  </span>
                )}
                {cityValid && !searchingCity && (
                  <span style={{ position: "absolute", right: "1rem", color: "#10b981", fontSize: "0.75rem" }}>
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* City Suggestions Autocomplete Dropdown */}
              {citySuggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    zIndex: 10,
                    maxHeight: "150px",
                    overflowY: "auto",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    marginTop: "0.3rem",
                  }}
                >
                  {citySuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectCity(suggestion)}
                      style={{
                        padding: "0.6rem 0.8rem",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        borderBottom: index < citySuggestions.length - 1 ? "1px solid rgba(255,255,255,0.02)" : "none",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 4: Review & Pay */}
      {step === 4 && (
        <motion.div key="step-4" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit">
          <h3 style={{ textAlign: "center", marginBottom: "1.8rem", color: "var(--text-primary)" }}>Confirm Session</h3>
          
          <div
            style={{
              background: "rgba(255, 255, 255, 0.01)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>TYPE</span>
                <span style={{ fontSize: "1.05rem", color: "var(--text-primary)", fontWeight: "bold" }}>{selectedPackage.title}</span>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>SCHEDULE</span>
                <span style={{ fontSize: "1.05rem", color: "var(--text-primary)", fontWeight: "bold" }}>
                  {selectedDate?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: getTargetTimezone() })} at {getSelectedSlotTimeLabel()}
                </span>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", fontSize: "0.85rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>NAME</span>
                <span style={{ color: "var(--text-primary)" }}>{formData.name}</span>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>BIRTH DETAILS</span>
                <span style={{ color: "var(--text-primary)" }}>
                  {formData.birthDate} ({formData.birthTime})
                </span>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>PLACE</span>
                <span style={{ color: "var(--text-primary)" }}>{formData.birthPlace}</span>
              </div>
            </div>

            {/* Promo / Coupon Code Section */}
            <div style={{ padding: "0.8rem", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Tag size={13} style={{ color: "var(--gold-primary)" }} /> HAVE A COUPON / PROMO CODE?
                </span>
                {appliedCoupon && (
                  <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "600" }}>APPLIED</span>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="form-input"
                  style={{ textTransform: "uppercase", fontSize: "0.85rem", padding: "0.45rem 0.8rem", flex: 1 }}
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="btn btn-secondary"
                    style={{ padding: "0.45rem 0.9rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="btn btn-secondary"
                    style={{ padding: "0.45rem 1rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}
                  >
                    Apply
                  </button>
                )}
              </div>
              {couponStatus.success && (
                <span style={{ fontSize: "0.8rem", color: "#10b981", display: "block", marginTop: "0.4rem" }}>
                  ✓ {couponStatus.success}
                </span>
              )}
              {couponStatus.error && (
                <span style={{ fontSize: "0.8rem", color: "#f87171", display: "block", marginTop: "0.4rem" }}>
                  ✕ {couponStatus.error}
                </span>
              )}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text-primary)", display: "block" }}>Total Amount</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{selectedPackage.duration} session</span>
              </div>
              <div style={{ textAlign: "right" }}>
                {appliedCoupon && (
                  <span style={{ fontSize: "1rem", color: "var(--text-muted)", textDecoration: "line-through", marginRight: "0.6rem" }}>
                    {formatPrice(selectedPackage, currency)}
                  </span>
                )}
                <span style={{ fontSize: "1.8rem", fontWeight: "bold", color: appliedCoupon ? "var(--gold-primary)" : "var(--text-primary)" }}>
                  {formatDiscountedPrice(selectedPackage, currency, appliedCoupon)}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "0.8rem",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            {currency === "INR" ? (
              <>Payments are securely routed via <strong>Razorpay</strong>. Supports international cards and UPI.</>
            ) : (
              <>Payments are securely routed via <strong>PayPal</strong>. Click &ldquo;Continue to Payment&rdquo; below to open the PayPal button.</>
            )}
          </div>

          {currency !== "INR" && paypalOrder && (
            <div style={{ marginBottom: "1rem" }}>
              <div ref={paypalContainerRef} />
            </div>
          )}
        </motion.div>
      )}

      {/* Step 5: Success State */}
      {step === 5 && (
        <motion.div
          key="step-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-primary)",
            }}
          >
            <Sparkles size={32} />
          </motion.div>
          <h2 style={{ fontSize: "1.6rem" }}>
            Session Confirmed
          </h2>
          <p style={{ maxWidth: "450px", margin: "0 auto", fontSize: "0.95rem" }}>
            Greetings, <strong>{formData.name}</strong>. Your session for <strong>{selectedPackage.title}</strong> has been successfully booked on <strong>{selectedDate?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: getTargetTimezone() })}</strong> at <strong>{getSelectedSlotTimeLabel()}</strong>.
          </p>
          <div
            style={{
              padding: "1.2rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius)",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              maxWidth: "450px",
              textAlign: "left",
            }}
          >
            <h4 style={{ color: "var(--text-primary)", marginBottom: "0.4rem", fontSize: "0.95rem" }}>What happens next?</h4>
            <ol style={{ paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li>A verification email and receipt has been registered to <strong>{formData.email}</strong>.</li>
              <li>A Google Meet video link will be sent to your email 24 hours prior.</li>
              <li>Shubham will chart your stars and prepare your responses beforehand.</li>
            </ol>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              changeStep(1);
              setSelectedDate(null);
              setSelectedSlotId("");
              setPaypalOrder(null);
            }}
            className="btn btn-primary"
            style={{ marginTop: "1rem", fontSize: "0.95rem", padding: "0.6rem 1.5rem" }}
          >
            Book Another Consultation
          </motion.button>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      {step <= 4 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
          {step > 1 ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handlePrevStep} className="btn btn-secondary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem" }}>
              Back
            </motion.button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNextStep} className="btn btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>
              Continue <ArrowRight size={16} />
            </motion.button>
          ) : currency !== "INR" && paypalOrder ? (
            // Booking + PayPal order already created — payment now happens via the PayPal
            // button rendered above, not this nav button.
            <div />
          ) : (
            <motion.button
              whileHover={{ scale: submitting ? 1 : 1.03 }}
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              onClick={handleSubmitBooking}
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: "0.6rem 2rem", fontSize: "0.9rem", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting
                ? "Initiating..."
                : currency === "INR"
                ? `Confirm & Pay ${formatDiscountedPrice(selectedPackage, currency, appliedCoupon)}`
                : `Continue to Payment (${formatDiscountedPrice(selectedPackage, currency, appliedCoupon)})`}
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}

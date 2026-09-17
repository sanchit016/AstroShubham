export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "review-1",
    name: "Rohan Mehta",
    role: "Senior Tech Director, Seattle, WA",
    quote:
      "I was undergoing a stressful Rahu Antardasha transition and considering a major career switch between tech giants. Shubhamji's precise timeline of planetary shifts gave me the clarity and confidence to wait for the right quarter. His advice was 100% accurate.",
    rating: 5,
    approved: true,
    createdAt: "2026-09-12T10:30:00.000Z",
  },
  {
    id: "review-2",
    name: "Priya & Aniket Sharma",
    role: "Couple Consultation, Toronto, ON",
    quote:
      "We booked the 60-minute couple consultation for our Kundli matching before finalizing our wedding date. Shubham explained the Manglik dosha nuances with logical Vedic depth and suggested very simple Lal Kitab remedies. It brought immense peace of mind to both families.",
    rating: 5,
    approved: true,
    createdAt: "2026-09-10T14:15:00.000Z",
  },
  {
    id: "review-3",
    name: "Dr. Vikramaditya Sen",
    role: "Cardiologist, London, UK",
    quote:
      "As a medical professional, I value logic and directness. Shubham does not engage in superstitious scare tactics or push costly gemstones. His analysis of my 10th and 6th houses for career relocation was spot on.",
    rating: 5,
    approved: true,
    createdAt: "2026-09-07T09:00:00.000Z",
  },
  {
    id: "review-4",
    name: "Meera Iyer",
    role: "Product Manager, Austin, TX",
    quote:
      "The 1-on-1 Google Meet session was so thorough and personal. He answered every single question about my Sade Sati period patiently without rushing. The simple water and copper remedies helped ground my daily stress within weeks.",
    rating: 5,
    approved: true,
    createdAt: "2026-09-04T16:45:00.000Z",
  },
  {
    id: "review-5",
    name: "Harpreet Singh Dhillon",
    role: "Logistics Business Owner, Vancouver, BC",
    quote:
      "Consulted Shubhamji regarding expanding our transport operations to eastern Canada. His calculation of Jupiter's transit and 11th house gains gave us exact timing. Truly genuine and highly knowledgeable.",
    rating: 5,
    approved: true,
    createdAt: "2026-09-01T11:20:00.000Z",
  },
  {
    id: "review-6",
    name: "Sneha Kulkarni",
    role: "Financial Analyst, Mumbai, India",
    quote:
      "I had consulted multiple astrologers before, but none explained the karmic planetary alignments like Shubham. He pointed out the exact root cause of my persistent job delays. Within two months of following his guidance, I received my dream offer.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-28T18:10:00.000Z",
  },
  {
    id: "review-7",
    name: "Aditya Verma",
    role: "Cloud Solutions Architect, Dallas, TX",
    quote:
      "Outstanding experience. The consultation was on time via Google Meet, clear audio-video, and he walked me through my D1, D9, and Varshphal charts on screen. Highly recommended for NRIs looking for genuine Vedic astrology.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-25T13:00:00.000Z",
  },
  {
    id: "review-8",
    name: "Ritu & Gaurav Bansal",
    role: "Marriage Compatibility, New Delhi",
    quote:
      "We were facing continuous misunderstandings in our first year of marriage. Shubhamji analyzed our 7th house and Venus placements and gave us simple household Lal Kitab adjustments. The harmony in our home improved visibly within 40 days.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-22T15:30:00.000Z",
  },
  {
    id: "review-9",
    name: "Kavita Patel",
    role: "Biotech Researcher, Boston, MA",
    quote:
      "I really appreciated that he didn't try to sell me any costly stones or commercial rituals. His remedies were practical daily habits and Lal Kitab principles. His predictions regarding my visa approval timeline were exact.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-19T10:15:00.000Z",
  },
  {
    id: "review-10",
    name: "Amanpreet Kaur",
    role: "Real Estate Broker, Calgary, AB",
    quote:
      "Shubham's insights into planetary dashas helped me understand why certain property deals were stalling in 2025 and when the tide would turn. The clarity and peace of mind after just one 45-minute session is priceless.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-16T17:00:00.000Z",
  },
  {
    id: "review-11",
    name: "Siddharth Roy",
    role: "Management Consultant, Singapore",
    quote:
      "Top-tier consultation. Very articulate, structured, and deep Vedic astrology knowledge. He explained the planetary debts (Rin) in my chart and gave very specific remedies that were easy to integrate into a busy corporate schedule.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-13T12:40:00.000Z",
  },
  {
    id: "review-12",
    name: "Divya & Karthik Raman",
    role: "Kundli Matching, Fremont, CA",
    quote:
      "Both our parents wanted an authentic astrologer who could explain chart compatibility in English without dogma. Shubham was respectful, patient, and thoroughly broke down the Ashtakoot 36 Guna score and mental wavelength.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-10T19:20:00.000Z",
  },
  {
    id: "review-13",
    name: "Rajesh Goel",
    role: "Industrialist, Ludhiana, Punjab",
    quote:
      "Shubham Chhabra is among the very rare astrologers who truly master Lal Kitab logic. His Varshphal predictions for my factory expansion were accurate down to the month. A trusted family advisor.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-07T11:00:00.000Z",
  },
  {
    id: "review-14",
    name: "Ananya Deshmukh",
    role: "UX Design Lead, Bangalore, India",
    quote:
      "I was feeling completely burnt out and lost in my career direction. Shubham identified my Mercury-Saturn conjunction and explained how to align my work with my natural planetary strengths. It brought back my confidence completely.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-04T14:50:00.000Z",
  },
  {
    id: "review-15",
    name: "Manish Tandon",
    role: "Investment Banker, New York, NY",
    quote:
      "Accurate, crisp, and no false promises. He told me upfront what was favorable and what periods required caution and patience. That level of honesty is rare in astrology today.",
    rating: 5,
    approved: true,
    createdAt: "2026-08-01T16:10:00.000Z",
  },
  {
    id: "review-16",
    name: "Sunita Aggarwal",
    role: "Educationist, Chandigarh, India",
    quote:
      "Consulted regarding my daughter's higher education abroad. Shubham predicted the exact admission window during her Jupiter transit. His calm demeanor and reassuring guidance gave us so much positivity.",
    rating: 5,
    approved: true,
    createdAt: "2026-07-28T09:30:00.000Z",
  },
  {
    id: "review-17",
    name: "Abhishek Nair",
    role: "Cybersecurity Architect, Melbourne, Australia",
    quote:
      "The booking process was seamless with instant Google Calendar invite and Google Meet link. Shubham analyzed my chart with incredible depth and answered all my questions on health, property, and career.",
    rating: 5,
    approved: true,
    createdAt: "2026-07-24T08:15:00.000Z",
  },
  {
    id: "review-18",
    name: "Pooja & Varun Kapoor",
    role: "Couple Consultation, Gurgaon, India",
    quote:
      "Shubham handled our relationship reading with tremendous empathy and wisdom. His advice on balancing planetary energies helped us communicate better and resolve longstanding friction. Truly grateful!",
    rating: 5,
    approved: true,
    createdAt: "2026-07-20T17:40:00.000Z",
  },
  {
    id: "review-19",
    name: "Karan Grover",
    role: "Tech Founder, Dubai, UAE",
    quote:
      "Before raising our seed round, I consulted Shubham for auspicious timing and co-founder chart synergy. His strategic astrological guidance proved right on target. An indispensable guide for entrepreneurs.",
    rating: 5,
    approved: true,
    createdAt: "2026-07-16T13:25:00.000Z",
  },
  {
    id: "review-20",
    name: "Neha Singhania",
    role: "HR Executive, Pune, India",
    quote:
      "From accurate past life events to realistic future timelines, Shubham's reading left me astonished. He gives you actionable clarity rather than fear. I recommend him to all my close friends and family.",
    rating: 5,
    approved: true,
    createdAt: "2026-07-12T15:00:00.000Z",
  },
];

/**
 * Programs Data Store — Centralized repository for all K12 Hunar programs.
 * NOTE: The copy below is Sample content. Verified factual data can be dropped in here directly.
 */

export const programs = [
  {
    slug: 'scholarship',
    category: 'Scholarship',
    tint: '#E8A317',
    tintBg: '#FFF8E6',
    topBorder: 'border-t-[#E8A317]',
    name: 'National Hunar Talent Scholarship',
    tagline: 'Support for students whose talent deserves a chance.',
    heroImage: '/images/programs/scholarship-hero.jpg',
    cardImage: '/images/programs/scholarship-card.jpg',
    overview: [
      'The scholarship helps students from Grade 6 to 12 continue their education and develop skills in academics, arts and technology.',
      'Selection is based on a short assessment and a review of the student\'s work, with extra consideration for need.',
    ],
    facts: [
      { label: 'Grades', value: '6 to 12' },
      { label: 'Support', value: 'Partial to full tuition waiver' },
      { label: 'Selection', value: 'Assessment + review' },
      { label: 'Intake', value: 'Once a year' },
    ],
    highlights: [
      'Merit and need based',
      'Open to students from any school',
      'Mentoring for selected students',
      'Guidance on documents and forms',
    ],
    steps: [
      {
        title: 'Send an inquiry',
        text: 'Submit student details, school background, and area of talent through our intake form.',
      },
      {
        title: 'Receive eligibility guidance',
        text: 'Our scholarship desk reviews your grade and sends documentation guidelines.',
      },
      {
        title: 'Take the assessment',
        text: 'A structured evaluation in core analytical, mathematical, or creative disciplines.',
      },
      {
        title: 'Results and onboarding',
        text: 'Selected scholars receive aid allocation, formal induction, and semester mentorship.',
      },
    ],
    gallery: [
      {
        src: '/images/programs/scholarship-1.jpg',
        alt: 'Students studying in a collaborative STEM laboratory',
      },
      {
        src: '/images/programs/scholarship-2.jpg',
        alt: 'Young scholar receiving academic recognition certificate',
      },
      {
        src: '/images/programs/scholarship-3.jpg',
        alt: 'Mentorship discussion between counselor and student',
      },
    ],
    faqs: [
      {
        q: 'Who can apply?',
        a: 'Students currently enrolled in Grades 6 through 12 across any recognized state, CBSE, ICSE, or international school board are eligible.',
      },
      {
        q: 'What documents are needed?',
        a: 'Academic report cards from the previous year, school identity proof, and family income documentation (if applying under need-based criteria).',
      },
      {
        q: 'Can parents apply on behalf of a student?',
        a: 'Yes, parents and legal guardians can complete the inquiry form and act as the primary contact during verification.',
      },
      {
        q: 'When are results announced?',
        a: 'Evaluation is completed within three weeks after the assessment window closes. All applicants receive formal notification via email.',
      },
    ],
  },
  {
    slug: 'concert',
    category: 'Concert',
    tint: '#D9552B',
    tintBg: '#FDF2EE',
    topBorder: 'border-t-[#D9552B]',
    name: 'Annual Inter-School Hunar Concert',
    tagline: 'A stage for young musicians, dancers and performers.',
    heroImage: '/images/programs/concert-hero.jpg',
    cardImage: '/images/programs/concert-card.jpg',
    overview: [
      'A yearly showcase where students from different schools perform together in front of an audience of families, teachers and guests.',
      'Schools can register groups, and individual students can audition for solo slots.',
    ],
    facts: [
      { label: 'Who', value: 'Students and schools' },
      { label: 'Categories', value: 'Music, dance, theatre' },
      { label: 'Format', value: 'Auditions then live showcase' },
      { label: 'Frequency', value: 'Yearly' },
    ],
    highlights: [
      'Solo and group performances',
      'Rehearsal guidance',
      'Certificates for all participants',
      'Open to audiences, tickets via inquiry',
    ],
    steps: [
      {
        title: 'Register interest',
        text: 'Schools register ensembles or individual candidates submit their preferred performing arts category.',
      },
      {
        title: 'Audition or group submission',
        text: 'Submit a 3-minute video sample or attend regional audition rounds with jury panelists.',
      },
      {
        title: 'Rehearsal schedule',
        text: 'Shortlisted performers join curated staging workshops, acoustic checks, and ensemble rehearsals.',
      },
      {
        title: 'Concert day',
        text: 'Perform live at our annual auditorium festival before peers, educators, and invited patrons.',
      },
    ],
    gallery: [
      {
        src: '/images/programs/concert-1.jpg',
        alt: 'High school orchestral music performance on stage',
      },
      {
        src: '/images/programs/concert-2.jpg',
        alt: 'Classical and contemporary dance troupe rehearsal',
      },
      {
        src: '/images/programs/concert-3.jpg',
        alt: 'Enthusiastic audience of parents and teachers applauding performers',
      },
    ],
    faqs: [
      {
        q: 'How do schools register a group?',
        a: 'The school cultural coordinator or music faculty submits an inquiry with the estimated troupe count and genre. Our event desk provides group forms.',
      },
      {
        q: 'Is there a participation fee?',
        a: 'No. Participation in the Hunar concert series is merit-based and free of charge for invited schools and qualifying individual auditionees.',
      },
      {
        q: 'Can parents attend?',
        a: 'Yes. Reserved family invitation passes are allocated to all participating performers, with additional seating available on request.',
      },
      {
        q: 'What are the age groups?',
        a: 'The festival features two brackets: Junior Division (Grades 6–8) and Senior Division (Grades 9–12).',
      },
    ],
  },
  {
    slug: 'admission',
    category: 'Admission',
    tint: '#1F5F4A',
    tintBg: '#EAF4EF',
    topBorder: 'border-t-[#1F5F4A]',
    name: 'K12 Curriculum Admissions',
    tagline: 'Clear guidance from first question to first day.',
    overview: [
      'Learning pathways that combine strong academics with skill-building, competitive exam preparation and mentoring.',
      'Our team helps families understand the process, documents and timelines before they apply.',
    ],
    facts: [
      { label: 'Grades', value: '6 to 12' },
      { label: 'Mode', value: 'Blended' },
      { label: 'Counselling', value: 'Free session' },
      { label: 'Intake', value: 'Rolling' },
    ],
    highlights: [
      'Free counselling session',
      'Document checklist',
      'Campus or online walkthrough',
      'Fee and seat information on request',
    ],
    steps: [
      {
        title: 'Send an inquiry',
        text: 'Provide basic grade and curriculum expectations through our simple admissions form.',
      },
      {
        title: 'Counselling call',
        text: 'Speak directly with an academic advisor to review course electives and learning formats.',
      },
      {
        title: 'Submit documents',
        text: 'Share prior academic transcripts and identification for eligibility review.',
      },
      {
        title: 'Confirmation',
        text: 'Receive course enrollment materials, timetable schedule, and advisor onboarding.',
      },
    ],
    gallery: [
      {
        src: '/images/programs/admission-1.jpg',
        alt: 'Modern interactive learning classroom with smart boards',
      },
      {
        src: '/images/programs/admission-2.jpg',
        alt: 'Academic counselor walking prospective parents through curriculum syllabus',
      },
      {
        src: '/images/programs/admission-3.jpg',
        alt: 'Students working on self-paced problem solving modules',
      },
    ],
    faqs: [
      {
        q: 'Which documents are required?',
        a: 'Previous academic year marksheet, transfer certificate (where applicable), birth certificate/ID proof, and passport-size photographs.',
      },
      {
        q: 'Is there an entrance test?',
        a: 'We conduct a friendly diagnostic readiness check to understand individual learning needs, not to reject students.',
      },
      {
        q: 'Can we visit before applying?',
        a: 'Yes. Families are welcome to book an in-person orientation tour or attend an online faculty Q&A session.',
      },
      {
        q: 'What are the fee options?',
        a: 'We provide structured annual, semester, and monthly payment options, along with tuition assistance for eligible applicants.',
      },
    ],
  },
  {
    slug: 'school-hub',
    category: 'General Query', // Stored in database as "General Query"
    tint: '#2F5D8A',
    tintBg: '#EEF4F9',
    topBorder: 'border-t-[#2F5D8A]',
    name: 'School Hub & Partnerships',
    tagline: 'For schools that want to work with us.',
    overview: [
      'Partner schools can bring teacher training, skill labs and co-branded student events to their campus.',
      'We discuss your goals first, then suggest a plan that fits your school\'s size and schedule.',
    ],
    facts: [
      { label: 'Who', value: 'Schools and institutions' },
      { label: 'Offers', value: 'Training, labs, events' },
      { label: 'Start', value: 'Intro call' },
      { label: 'Agreement', value: 'MoU' },
    ],
    highlights: [
      'Teacher training programs',
      'Skill and lab setup support',
      'Co-branded student events',
      'Dedicated point of contact',
    ],
    steps: [
      {
        title: 'Intro inquiry',
        text: 'School leadership or academic heads share key institutional goals and cohort sizes.',
      },
      {
        title: 'Needs discussion',
        text: 'A 30-minute discovery call with our institutional director to align on scope and term schedules.',
      },
      {
        title: 'Proposal',
        text: 'Our team delivers a structured engagement plan including curriculum modules, lab gear, and costs.',
      },
      {
        title: 'Partnership MoU',
        text: 'Formal agreement signing followed by teacher training and on-campus lab establishment.',
      },
    ],
    gallery: [
      {
        src: '/images/programs/school-hub-1.jpg',
        alt: 'Educators attending a specialized professional development workshop',
      },
      {
        src: '/images/programs/school-hub-2.jpg',
        alt: 'School principal and K12 Hunar representatives reviewing an institutional agreement',
      },
      {
        src: '/images/programs/school-hub-3.jpg',
        alt: 'Secondary school laboratory equipped with interactive learning kits',
      },
    ],
    faqs: [
      {
        q: 'What does a partnership include?',
        a: 'Faculty training certifications, hands-on STEM & arts workshop materials, student Olympiad registrations, and dedicated program managers.',
      },
      {
        q: 'Is there a cost for schools?',
        a: 'We provide both sponsored grant-supported models for government/aided schools and subscription tiers for private institutions.',
      },
      {
        q: 'How long does onboarding take?',
        a: 'From initial proposal acceptance to teacher workshop commencement typically takes two to four weeks.',
      },
      {
        q: 'Can we start with one event?',
        a: 'Yes. Many schools start by co-hosting a single inter-school contest or weekend faculty clinic before signing an annual MoU.',
      },
    ],
  },
];

export const getProgramBySlug = (slug) => {
  return programs.find((p) => p.slug === slug) || null;
};

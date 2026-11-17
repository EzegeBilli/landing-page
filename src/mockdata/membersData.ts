import kenny from "../assets/images/png/directors/Kenny_Bankejesu_web.jpg";
import betty from "../assets/images/png/directors/Daniel Betty.png";
import kuye from "../assets/images/png/directors/kuye-micheal.png";
import abel from "../assets/images/png/directors/Abel Christopher.jpg";
import favour from "../assets/images/png/directors/Favour Onyeziri.jpeg";
import philemon from "../assets/images/png/directors/ThankGod Philemon.jpeg";
import marvelous from "../assets/images/png/directors/Marvelous Life-Alegbemi.jpeg";
import ebikaboere from "../assets/images/png/directors/Ebi Friday.jpeg";
import akhabue from "../assets/images/png/directors/jennifer-akhabue-web.jpg";
import kalu from "../assets/images/png/directors/youn-raph.png";
import john from "../assets/images/png/directors/john-paul.png";
import bashua from "../assets/images/png/directors/Mubarak Bashua.jpg";
import Wereyesigha from "../assets/images/png/directors/mike-dick.png";
import abraham from "../assets/images/png/directors/onel.jpeg";
import godwill from "../assets/images/png/directors/IMG_5794 - Gloria Godwill.png";
import Chidimma from "../assets/images/png/directors/Chidimma Ezekwe.jpeg";
import confidence from "../assets/images/png/directors/confidence.jpeg";
import lloyd from "../assets/images/png/directors/lloyd.png";
import joshua from "../assets/images/png/directors/omeonu joshua.png";
import anuoluwapo from "../assets/images/png/directors/Anuoluwapo Enitan Popoola.jpeg";
import marycelestina from "../assets/images/png/directors/marycelestina-albert.jpg";
import olisemeke from "../assets/images/png/directors/olisemeke-azuka.jpg";
import agadi from "../assets/images/png/directors/agadi1.jpeg";
import godstime from "../assets/images/png/directors/godstime.jpeg";

import type { MemberProfile } from "../types";

/**
 * Ordered strictly by hierarchy: President → Vice Presidents → Secretariat →
 * Treasury → Directors (by department) → Assistant Directors → Provost
 * Marshal → General Members.
 *
 * `rank` is a string (per the shared MemberProfile type) but holds a
 * numeric value used purely for ordering — lower = higher in hierarchy.
 */
export const allMembers: MemberProfile[] = [
  // ===== 1. PRESIDENT =====
  {
    id: "uwaoma-lloyd-nnaemeka",
    name: "Uwaoma Lloyd Nnaemeka",
    title: "President",
    profession: "Marine Engineer | Operations & Technical Management",
    tenure: "2026 – 2028",
    image: lloyd,
    rank: "1",
    shortBio:
      "Pioneer Chief Cadet Captain of NMU and Marine Engineer with experience in vessel maintenance, dry-dock operations, and maritime safety. Serves as President of the NMU Alumni Association.",
    fullBio:
      `  Uwaoma Lloyd Nnaemeka is a Marine Engineering graduate of Nigeria Maritime University (NMU), where he graduated with a Second Class Upper Division and has an affiliation with the Nigeria Society of Engineers (NSE). As a member of the pioneer set of the university's Marine Engineering programme, he was actively involved in the early development of the university's student leadership structure and remains committed to its growth and institutional advancement.
A distinguished student leader, Uwaoma served as the pioneer Chief Cadet Captain and General Leader of the university's student body, providing leadership to a community of over 3,000 students. In this capacity, he played significant roles in promoting discipline, maintaining regimentation, supporting student welfare, encouraging academic responsibility, and representing students in engagements with university management. His leadership responsibilities also involved coordinating student leadership activities, participating in executive meetings, and facilitating communication between students and the university authorities.
His commitment to service and exemplary leadership earned him several recognitions from the university management, including multiple Best in Regimentation Awards and the prestigious Overall Best Leadership Award, presented by retired Navy Commodore Kingdom Itoko. These recognitions reflect his dedication to discipline, responsibility, effective leadership, and service to the university community.
Professionally, Uwaoma is building a career in Marine Engineering, with practical experience in marine engine-room operations, machinery monitoring, maintenance support, equipment inspection, and offshore operations. He began his professional journey as an Engine Cadet, where he gained foundational experience in vessel engineering operations, preventive maintenance, safety procedures, and the practical application of marine engineering principles. 
His professional experience has strengthened his interest in marine machinery, equipment maintenance, engineering reliability, offshore operations, and the continuous improvement of safety and operational standards within the maritime sector. He remains committed to professional development and the acquisition of advanced technical knowledge that will enable him to make meaningful contributions to the industry.
In addition to his professional pursuits, Uwaoma is passionate about mentorship, alumni engagement, institutional development, and strengthening the relationship between academic training and industry practice. He currently serves as the National President of the Nigeria Maritime University Alumni Community, where he is committed to promoting unity among graduates, encouraging professional networking, creating opportunities for mentorship, and fostering collective participation in the development of the university.
His long-term vision is to contribute to the advancement of Nigeria's maritime and offshore industries while supporting the development of future marine engineering professionals. He aspires to bridge the gap between academic knowledge and practical industry experience through professional practice, postgraduate education, mentorship, research, and, ultimately, contributions to maritime education and institutional development.
Uwaoma's journey reflects a combination of academic commitment, practical engineering experience, leadership, service, and a sustained desire to contribute to the growth of Nigeria Maritime University and the wider maritime community. `,
    category: "executive",
  },

  

  // ===== 2. VICE PRESIDENTS =====
  {
    id: "christopher-ogoyi-abel",
    name: "Christopher Ogoyi Abel",
    title: "Vice President",
    profession: "Marine Engineer",
    tenure: "2026 – 2028",
    image: abel,
    rank: "2",
    shortBio:
      "Marine Engineer and one of the pioneer graduates of the Department of Marine Engineering. Serves as Vice President of the NMU Alumni Association.",
    fullBio:
      'Christopher Abel is a Marine Engineer and one of the pioneer graduates of the Department of Marine Engineering, Faculty of Engineering. During his time at the university, he served as Head of the Police Department in the Regimentation Unit, where he was involved in maintaining discipline and coordinating student activities.\n\nHe also played active leadership roles in student events, serving as Committee Chairman for the NMU First Dinner and Award Night with Commodore Kingdom Itoko, and as Head of Logistics and Set-Up for the first Dean’s Cup held in NMU.\n\nHe is the founder of the "NMU Fellowship of Christian Students" (now "Believers Community") and "Xoe Church" in Port Harcourt, both established to support spiritual growth, fellowship, and mentorship.\n\nHe is currently building his career in the maritime industry as a Marine Engineer, while continuing to grow in leadership, service, and community impact.',
    category: "executive",
  },
  {
    id: "ebikaboere-friday",
    name: "Ebikaboere Friday",
    title: "Vice President External",
    profession: "Alumni Leader",
    tenure: "2026 – 2028",
    image: ebikaboere,
    rank: "3",
    shortBio: "Vice President External of the NMU Alumni Association.",
    fullBio:
      "Ebikaboere Friday currently serves as Vice President External of the NMU Alumni Association. A full bio will be updated soon.",
    category: "executive",
  },

  // ===== 3. SECRETARIAT =====
  {
    id: "onyeziri-adanna-favour",
    name: "Onyeziri Adanna Favour",
    title: "Secretary",
    profession: "Nautical Science | Sailor",
    tenure: "2026 – 2028",
    image: favour,
    rank: "4",
    shortBio:
      "Graduate of Nautical Science currently serving as a sailor. Committed to fostering effective communication, strengthening alumni engagement, and promoting meaningful connections among members.",
    fullBio:
      "My name is Favour Onyeziri, a graduate of Nautical Science from the Nigerian Maritime University. I currently work in the maritime industry as a sailor and have completed my cadetship training, with ongoing preparations toward obtaining my Officer of the Watch (OOW) license. My professional journey is driven by a strong commitment to excellence in seamanship, continuous learning, and advancement within the global shipping industry.\n\nI serve as the Secretary of the Alumni Association, where I am responsible for coordinating communication, documenting proceedings, maintaining accurate records, and ensuring effective administrative support for the smooth operation of the association. In this role, I am dedicated to promoting transparency, organization, and efficiency in all correspondence and activities, while also fostering collaboration among members.\n\nMy passion lies in the maritime sector, where I am deeply committed to safety at sea, professional development, and adherence to international standards of practice. I value mentorship and strongly believe in creating platforms that connect experienced professionals with younger graduates to guide their growth and career progression.\n\nAs Secretary, my vision is to strengthen the alumni network into a well-structured and impactful body that promotes unity, professional advancement, and opportunities for members. I aim to contribute to building a sustainable support system that enhances engagement, encourages knowledge sharing, and strengthens the collective identity of our alumni community within the maritime industry and beyond.",
    category: "executive",
  },
  {
    id: "odianosen-abraham-nelson",
    name: "Odianosen Abraham Nelson",
    title: "Assistant Secretary",
    profession:
      "Maritime Officer | Founder, O'Nelsons Marine Consulting Services",
    tenure: "2026 – 2028",
    image: abraham,
    rank: "5",
    shortBio:
      "Pioneer graduate of Port Management. Founder of O'Nelsons Marine Consulting Services and Assistant Secretary of the NMU Pioneer Alumni Association.",
    fullBio:
      "Odianosen Abraham Nelson is a Pioneer Graduate of Port Management from the Nigerian Maritime University (NMU), Okerenkoko, and a maritime professional with practical exposure to vessel operations, vessel fastening, cargo operations, and marine logistics.\n\nHe began building his professional maritime experience through an industrial training placement with the Nigerian Maritime Administration and Safety Agency (NIMASA), Lagos, where he served as a Maritime Intern from February to July 2021. During his internship, he supported the processing of vessel manifests and statutory 3% Sea Protection Levy, participated in vessel inspections to verify compliance with maritime safety regulations, and assisted in the issuance of vessel clearance certificates, gaining practical exposure to maritime administration, regulatory compliance, and vessel documentation.\n\nHe has continued to strengthen his professional competence through extensive maritime, safety, security, and professional development training. His maritime qualifications include STCW Basic Safety Training, Crew Security Awareness with Designated Duties under the ISPS Code, Efficient Deck-Hand certification, Watchkeeping (STCW Regulation II/4) Certificate of Competency, and Proficiency in Survival Craft and Rescue Boats (PSCRB). He has also completed training in Health, Safety and Environment (HSE) Levels 1–3, Human Resource Management, Strategic Human Resource Management, Digital Communication, and Artificial Intelligence for Human Resource Management, alongside his National Youth Service Corps (NYSC) Certificate.\n\nOdianosen is the Founder and Managing Lead of O'Nelsons Marine Consulting Services, a marine-focused venture providing services relating to vessel sales and hire, container sales and hire, tugboats, barges, houseboats, and responsible disposal of scrap machinery and marine equipment.\n\nBeyond his professional engagements, he is committed to leadership, youth development, and strengthening the network of graduates of the Nigerian Maritime University. He currently serves as the Assistant Secretary of the NMU Pioneer Alumni Association, contributing to administrative coordination, stakeholder engagement, and initiatives aimed at promoting the welfare, unity, and advancement of alumni members.\n\nHe is passionate about excellence, integrity, continuous learning, professional development, and the growth of Nigeria's maritime industry, with a vision of contributing meaningfully to the future of the sector.",
    category: "executive",
  },

  // ===== 4. TREASURY =====
  {
    id: "wereyesigha-michael",
    name: "Wereyesigha Michael",
    title: "Treasurer",
    profession: "Businessman | Entrepreneur",
    tenure: "2026 – 2028",
    image: Wereyesigha,
    rank: "6",
    shortBio:
      "Dedicated businessman committed to excellence, growth, and creating value. Serves as Treasurer of the NMU Alumni Association.",
    fullBio:
      "My name is Dickson, and I am a dedicated businessman with a strong passion for entrepreneurship, growth, and creating opportunities. Over the years, I have developed a deep appreciation for hard work, integrity, and the value of building meaningful relationships. I am committed to excellence in every endeavor and continually seek ways to expand my knowledge, improve my skills, and contribute positively to society.\n\nBeyond business, I believe in giving back to my community and supporting initiatives that bring people together and create lasting impact. My vision is to build successful ventures, inspire others through my journey, and leave a legacy of service, leadership, and positive change.",
    category: "executive",
  },
  {
    id: "confidence-onuoha",
    name: "Confidence Onuoha",
    title: "Assistant Treasurer",
    profession: "Petroleum & Gas Engineer | Financial Advisor",
    tenure: "2026 – 2028",
    image: confidence,
    rank: "7",
    shortBio:
      "Petroleum and Gas Engineering graduate and pioneer student of NMU. Financial Advisor at AIICO Insurance PLC and Assistant Treasurer of the NMU Alumni Organization.",
    fullBio:
      "Confidence Onuoha is a Petroleum and Gas Engineering graduate and a pioneer student of Nigeria Maritime University (NMU). She is passionate about professional development, leadership, service, and community building.\n\nDuring her time at NMU, Confidence was one of the founding members of Divine Mercy Chaplaincy, where she served as Financial Secretary for four years. Through this role, she contributed to the effective financial administration of the organization and supported various initiatives focused on fellowship and community development.\n\nHer commitment to service and leadership has continued beyond her university years. She currently serves as Assistant Treasurer of the NMU Alumni Organization, contributing to the financial management and activities of the alumni community.\n\nProfessionally, Confidence is currently a Financial Advisor with AIICO Insurance PLC, where she works with individuals and businesses to provide financial protection and planning solutions that align with their needs and goals.\n\nWith a foundation in engineering and experience in financial advisory, leadership, and organizational administration, Confidence continues to build a dynamic career while seeking opportunities to learn, grow, serve, and make a meaningful impact in her professional and wider community.",
    category: "executive",
  },
  {
    id: "marycelestina-albert",
    name: "Marycelestina Albert",
    title: "Auditor",
    profession: "Audit Analyst | Audit & Assurance Professional",
    tenure: "2026 – 2028",
    image: marycelestina,
    rank: "8",
    shortBio:
      "Experienced Audit Analyst at KPMG Nigeria and pioneer Petroleum and Gas Engineering graduate of NMU. Serves as Auditor of the NMU Alumni Association.",
    fullBio:
      "Marycelestina Albert is an experienced Audit Analyst at KPMG Nigeria, with professional experience in audit and assurance, financial reporting, risk assessment, and internal controls. She is a pioneer graduate of Nigeria Maritime University (NMU), where she obtained a Bachelor of Engineering degree in Petroleum and Gas Engineering.\n\nShe currently works in the audit profession, contributing to audit engagements and the evaluation of financial information and internal control processes. Her professional interests include financial accountability, risk management, corporate governance, and the promotion of sound financial practices.\n\nBefore commencing her career in audit, Marycelestina completed her National Youth Service Corps (NYSC) at Beryl Voice Academy, Ogun State, where she gained teaching experience and developed valuable communication, organisational, and problem-solving skills.\n\nHer career reflects a blend of technical education, analytical expertise, and professional adaptability. As Auditor of the NMU Alumni Association, she is committed to promoting transparency, accountability, and responsible financial management while supporting the Association's continued growth and development.",
    category: "executive",
  },

  // ===== 5. DIRECTORS =====
  {
    id: "thankgod-philemon-chizhimelozu",
    name: "Philemon Chizhimeliozu ThankGod",
    title: "Director of Finance",
    profession:
      "Tax Professional | Public Finance Practitioner | Legislative & Fiscal Policy Professional",
    tenure: "2026 – 2028",
    image: philemon,
    rank: "9",
    shortBio:
      "Tax and public sector professional with experience across tax administration, public finance, legislative affairs and fiscal reform.",
    fullBio:
      "Philemon Chizhimeliozu ThankGod is a tax and public sector professional with experience across tax administration, public finance, legislative affairs and fiscal reform.\n\nHe currently serves with the Nigeria Revenue Service (NRS), Emerging Taxpayers Audit, contributing to the administration and enforcement of Nigeria’s tax framework. His professional interests span taxation, revenue mobilisation, fiscal policy and institutional reform.\n\nA graduate of Marine Economics and Finance, Philemon previously served with the Senate Committee on Finance, National Assembly, before proceeding to the NRS, where he gained exposure to high level legislative and fiscal processes and contributed to work surrounding significant reforms to Nigeria’s tax and public finance architecture, including the Nigeria Tax Reform Bills amongst other landmark legislations.\n\nHis career reflects a distinctive combination of technical tax practice, legislative experience and public sector engagement, placing him at the intersection of revenue, law and investment and economic policy.\n\nHe is passionate about sustainable economic growth, public sector accountability, revenue optimisation, and community development. As an alumnus, he remains committed to fostering unity, mentorship, and meaningful collaboration among members of the alumni community.",
    category: "directors",
  },
  {
    id: "ebikonboere-betty-daniel",
    name: "Ebikonboere Betty Daniel",
    title: "Director of Communications & Media",
    profession: "Data Analyst | Communications Professional",
    tenure: "2026 – 2028",
    image: betty,
    rank: "10",
    shortBio:
      "First-Class graduate of Port Management. Data Analyst, Social Media Manager, and communications professional serving as Director of Communication and Media.",
    fullBio:
      "Daniel Ebikonboere Betty is a First-Class graduate of Port Management from the Nigeria Maritime University, Okerenkoko, Delta State. She is a Data Analyst, Social Media Manager, entrepreneur, and communications professional with experience in data analytics, administration, digital communications, and business development.\n\nShe currently serves as the Director of Communication and Media of the Nigeria Maritime University Alumni Association, where she supports alumni engagement, promotes association activities, and contributes to strengthening the alumni network. She also works as a Data Analyst and Social Media Manager for a fashion brand, leveraging data-driven insights and digital strategies to support business growth and brand visibility.\n\nBetty has developed expertise in data analysis, reporting, dashboard development, data visualization, and business intelligence using tools such as Microsoft Excel, Google Sheets, SQL, Python, and R. During her internship with Excelerate, she gained hands-on experience in data cleaning, analysis, visualization, and stakeholder reporting.\n\nBeyond her professional career, Betty is a makeup artist and entrepreneur with interests in the beauty and agricultural sectors. She is passionate about leadership, innovation, continuous learning, and using data-driven solutions to solve real-world challenges. She aspires to pursue advanced studies in Data Analytics, Economics, and Business Administration while building impactful ventures that contribute to sustainable development.",
    category: "directors",
  },
   
    // ==== Director of Institutional Advancement and Development
   
  {
    id: "bankejesu-kenny-oluwakolade",
    name: "Bankejesu Kenny Oluwakolade",
    title: "Director of Institutional Advancement and Development",
    profession: "Petroleum & Gas Engineer | Field Engineer",
    tenure: "2026 – 2028",
    image: kenny,
    rank: "11",
    shortBio:
      "Petroleum and Gas Engineering graduate and multidisciplinary professional with experience spanning engineering, technology, innovation, and community leadership.",
    fullBio:
      "Bankejesu Kenny Oluwakolade is an engineer, innovator, and development-focused leader whose work spans petroleum engineering, technology, product innovation, and institutional advancement. He holds a Bachelor’s degree in Petroleum and Gas Engineering from Nigeria Maritime University, where he graduated with a strong academic record and developed an early interest in applying technology and data-driven solutions to complex industry and societal challenges.\n\nHis professional journey combines technical engineering experience with innovation and leadership. Kenny currently works as a Field Engineer at Sterling Oil Exploration and Energy Production Company, where he contributes to well cementing operations, field engineering activities, operational safety, and technical support within the oil and gas sector. Prior to this, he served at the Nigeria Maritime Administration and Safety Agency (NIMASA) as a Marine Surveyor Trainee, gaining experience in maritime safety, vessel inspections, and regulatory compliance.\n\nAlongside his engineering career, Kenny has built expertise in product design, data analysis, and digital innovation. He holds certifications in Data Analysis, UI/UX Design, and Design Thinking and has continued to expand his knowledge through professional and academic learning programs.\n\nA notable milestone in his academic and innovation journey was his selection as an Academia-Sponsored Presenter at the SLB Digital Forum 2024 in Monaco, where he presented his machine learning research project titled “Predicting Hole Deviation Using Machine Learning.” The work explored the application of artificial intelligence in drilling optimization and reflected his growing interest in the intersection of engineering and emerging technologies.\n\nKenny is also the founder of TRANSY, a transportation technology and financial inclusion initiative focused on building a unified payment and data infrastructure for Nigeria’s transport ecosystem. Through Transy, he seeks to address challenges surrounding cash dependency, transport inefficiencies, safety, compliance, and financial exclusion by connecting commuters, drivers, transport operators, and institutions through digital infrastructure and intelligent mobility systems.\n\nBeyond professional and entrepreneurial pursuits, Kenny is actively involved in leadership and community development. He has served in mentoring, volunteer, and youth leadership capacities and is passionate about empowering young people, supporting institutional growth, and creating systems that deliver lasting social and economic value.\n\nAs Director of Institutional Advancement and Development within the alumni community, Kenny brings a forward-looking vision centered on alumni engagement, partnership development, strategic growth, and sustainable institutional progress. He believes strongly in the role of alumni networks as catalysts for opportunity, innovation, mentorship, and long-term institutional impact.",
    category: "directors",
  },

   {
    id: "godstime-omada",
    name: "Godstime Omada ",
    title: "Assistant Director of Institutional Advancement and Development",
    profession: "Civil Engineer",
    tenure: "2026 – 2028",
    image: godstime,
    rank: "11",
    shortBio:
       `  Godstime Omada is a graduate of Civil Engineering from the Nigeria Maritime University.
        He currently works as a Civil Engineer with the Niger Delta Development Commission (NDDC), where he contributes to infrastructure development projects across the region.
        In addition to his professional role, he serves as the Assistant Director for Institutional Advancement and Development in the NMU Alumni Association, where he supports alumni engagement, partnerships, and initiatives for the long-term growth of the institution.
         He combines his engineering background with a strong commitment to community development and institutional progress. `,
    fullBio:
     `  Godstime Omada is a graduate of Civil Engineering from Nigeria Maritime University (NMU), where he acquired a strong academic foundation in engineering principles, infrastructure development, structural design, and the technical processes involved in the planning, construction, and maintenance of civil engineering projects. His educational background has equipped him with the knowledge and professional skills required to contribute to the development of sustainable infrastructure and the advancement of the built environment.
       He currently works as a Civil Engineer with the Niger Delta Development Commission (NDDC), where he contributes to infrastructure development initiatives and projects across the Niger Delta region. In this capacity, he is involved in the broader efforts to promote infrastructural growth, improve community development, and support the delivery of projects that address the developmental needs of the region. His professional engagement reflects his interest in applying engineering knowledge and technical expertise to practical challenges, particularly those associated with infrastructure provision and regional development.
       Beyond his professional responsibilities, Godstime is actively involved in alumni leadership and institutional development. He serves as the Assistant Director for Institutional Advancement and Development of the Nigeria Maritime University Alumni Association, where he plays a role in supporting initiatives aimed at strengthening the relationship between the university and its graduates. His responsibilities include contributing to alumni engagement, fostering institutional partnerships, encouraging collaboration among members, and supporting programmes and initiatives that promote the long-term growth, visibility, and development of the university.
      Through his involvement in the Alumni Association, he recognizes the importance of building a strong and united alumni network that can contribute meaningfully to the advancement of the institution. He is particularly interested in initiatives that encourage professional networking, mentorship, strategic partnerships, knowledge sharing, and the mobilization of alumni resources towards institutional development. He believes that alumni engagement provides an important platform for connecting graduates, creating opportunities for collaboration, and giving back to the institution that played a significant role in their academic and professional development.
      Godstime combines his technical background in Civil Engineering with a strong commitment to leadership, community development, and institutional progress. His professional and organizational engagements demonstrate his interest in contributing beyond his immediate career responsibilities by participating in initiatives that create lasting value for communities and institutions. He is passionate about the role of engineering in driving sustainable development and believes that effective collaboration, strategic leadership, and collective responsibility are essential to achieving meaningful progress.
      As a young professional and an active member of the Nigeria Maritime University alumni community, he remains committed to continuous professional growth, service, and making meaningful contributions to the development of his profession, his alma mater, and the Niger Delta region at large.`  ,
    category: "directors",
  },


  {
    id: "kuye-micheal-oluwaseun",
    name: "Kuye Micheal Oluwaseun",
    title: "Director of Welfare, Programmes & Events",
    profession: "Marine Geology | Regional Lead (North)",
    tenure: "2026 – 2028",
    image: kuye,
    rank: "12",
    shortBio:
      "Marine Geology graduate of Nigeria Maritime University and Regional Lead (North) at Neo Urban Gas and Power. Specializes in business development, stakeholder engagement, and strategic partnerships.",
    fullBio:
      "Kuye Micheal Oluwaseun is a Marine Geology graduate of Nigeria Maritime University and currently serves as Regional Lead (North) at Neo Urban Gas and Power in collaboration with Fraz Energy. He specializes in business development, stakeholder engagement, and strategic partnerships within the energy sector, with a passion for sustainable development, leadership, and community impact.",
    category: "directors",
  },
  {
    id: "akhabue-jennifer-ese",
    name: "Akhabue Jennifer Ese",
    title: "Director of Career and Professional Development",
    profession: "Project Manager | Entrepreneur",
    tenure: "2026 – 2028",
    image: akhabue,
    rank: "13",
    shortBio:
      "Project Manager, Talent Manager, entrepreneur, and business leader. Owner of Shop Lure Essentials.",
    fullBio:
      "Akhabue Jennifer is a Project Manager, Talent Manager, entrepreneur, and business leader with a passion for building brands, managing high-impact projects, and driving business growth. She is the owner of Shop Lure Essentials, a home fragrance and décor brand specializing in scented candles, diffusers, and room sprays.",
    category: "directors",
  },
  {
    id: "omeonu-joshua",
    name: "Omeonu Joshua",
    title: "Director of Membership & Database Management",
    profession: "Software Engineer | Digital Platforms",
    tenure: "2026 – 2028",
    image: joshua,
    rank: "14",
    shortBio:
      "Software engineer and Director of Database Management. Builds the digital platforms and member database that the NMU Alumni Association operates on, and supports operational work including mentorship.",
    fullBio:
      "Omeonu Joshua is a software engineer and Mechanical Engineering graduate of Nigerian Maritime University. He serves as Director of Database Management of the NMU Alumni Association, where he is responsible for the association’s member database and the digital platforms through which alumni records, communication, and operations are managed.\n\nIn this role, he designs, builds, and maintains the systems that support membership data, alumni profiles, administrative workflows, and online engagement. He also assists with operational programmes, including mentorship coordination, by putting structure, records, and digital tools behind the work so members can connect and the association can function more efficiently.\n\nProfessionally, Joshua works across the JavaScript and TypeScript ecosystem, including React, Next.js, Angular, NestJS, and Express, with production experience building web platforms, APIs, and data-driven interfaces. He is currently expanding into .NET and AI automation, with an interest in using intelligent systems to reduce manual work in operations, records, and member support.\n\nAs an alumnus and director, he is committed to accurate records, reliable digital infrastructure, and practical systems that strengthen mentorship, membership, and the long-term organisation of the alumni community.",
    category: "directors",
  },
  {
    id: "mubarak-bashua",
    name: "Mubarak Bashua",
    title: "Director of Mentorship and Student Relations",
    profession: "Mechanical Engineer",
    tenure: "2026 – 2028",
    image: bashua,
    rank: "15",
    shortBio:
      "Mechanical Engineering graduate with a strong passion for innovation, research, and problem-solving.",
    fullBio:
      "Mubarak Bashua is a Mechanical Engineer with a strong passion for innovation, research, and the application of engineering principles to solve real-world challenges. He holds a degree in Mechanical Engineering and has developed a multidisciplinary interest in energy systems, materials science, data analytics, process optimization, and industrial operations.\n\nProfessionally, Mubarak has gained hands-on experience in engineering and maintenance operations, contributing to the reliability, efficiency, and performance of industrial equipment and processes. His work has involved supporting operational improvements, analyzing system performance, and implementing practical solutions that enhance productivity and sustainability. Through these experiences, he has developed strong technical, analytical, and problem-solving skills, as well as an appreciation for the role of engineering in driving industrial and economic development.\n\nBeyond his professional responsibilities, Mubarak is deeply interested in emerging technologies and their potential to transform industries. He is particularly fascinated by the intersection of engineering, data-driven decision-making, and sustainable development. His academic and personal interests have led him to explore topics such as energy materials, nanotechnology, machine learning applications, and digital transformation, reflecting his commitment to staying at the forefront of technological advancement.\n\nMubarak is a lifelong learner who values continuous personal and professional growth. He actively seeks opportunities to expand his knowledge, collaborate with diverse teams, and contribute to initiatives that create meaningful impact. As he continues to build his career, he remains dedicated to leveraging engineering and innovation to address complex challenges, improve operational excellence, and contribute to a more sustainable future.",
    category: "directors",
  },
  {
    id: "olisemeke-azuka",
    name: "Olisemeke Azuka",
    title: "Director for Maritime Affairs",
    profession: "Maritime Labour Consultant | Seafarer",
    tenure: "2026 – 2028",
    image: olisemeke,
    rank: "16",
    shortBio:
      "Maritime Labour Consultant and active Seafarer with hands-on experience in shipboard operations, logistics, safety, and maritime regulatory compliance. Pioneer graduate of NMU.",
    fullBio:
      "Olisemeke Azuka is a Maritime Labour Consultant and an active Seafarer with hands-on practical experience in shipboard operations, logistics, safety, and maritime regulatory compliance.\n\nHe is a pioneer graduate of the Nigerian Maritime University. He also holds other academic and professional qualifications relevant to a seafaring career, covering areas such as offshore navigation, seamanship, shipping logistics, general ship knowledge, maritime safety, and various maritime regulations and standards.\n\nHe currently works in the offshore sector of the Nigerian maritime industry and the downstream sector of the petroleum industry.\n\nHaving served on board various seagoing vessels, working alongside different nationalities under different articles, and with substantial years of experience within the Nigerian maritime domain and across various ports in Africa, he has acquired first-hand knowledge of port operations, international relations, seafaring, and maritime labour standards.\n\nAs an alumnus, his dedication to improving human capacity and maritime affairs enlightenment will help propel smooth career advancement and shape the maritime know-how of members across the alumni community.",
    category: "directors",
  },

  // ===== 6. ASSISTANT DIRECTORS =====
  {
    id: "marvelous-life-alegbemi",
    name: "Marvelous Life Alegbemi",
    title: "Assistant Director of Institutional Advancement & Development",
    profession: "Geologist | GIS Professional | SDGs Advocate",
    tenure: "2026 – 2028",
    image: marvelous,
    rank: "17",
    shortBio:
      "Pioneer graduate with First Class Honours in Marine Geology. Assistant Director of Institutional Advancement & Development.",
    fullBio:
      "Marvelous Life Alegbemi is a geologist with a strong academic foundation and expertise in geoscience, geospatial analysis and map digitization, utilizing GIS knowledge to address human and environmental challenges, to support Sustainable Development Goals (SDGs). She is a refined problem-solver with good virtual administrative skills, and currently a Co-Director at Go Green Development Consultancy Ltd., contributing to project planning and stakeholder engagement.\n\nWithin the Nigeria Maritime University Alumni Association, Marvelous serves as the Assistant Director of Institutional Advancement & Development, and through her service, she remains dedicated to building stronger connections between alumni and the institution while creating opportunities that benefit current and future generations of students.\n\nHer interests include geospatial technologies, environmental sustainability, humanitarian services, education advancement, and community impact.",
    category: "directors",
  },
  {
    id: "john-paul",
    name: "John Paul",
    title: "Assistant Director of Welfare",
    profession: "Community Leader | Agripreneur",
    tenure: "2026 – 2028",
    image: john,
    rank: "18",
    shortBio:
      "Dedicated community leader, agripreneur, and technology enthusiast serving as Assistant Director of Welfare.",
    fullBio:
      "John Paul is a graduate of the Nigerian Maritime University and currently serves as the Assistant Director of Welfare of the NMU Alumni Association. In this role, he is committed to promoting the well-being of alumni members, fostering unity, and supporting initiatives that strengthen the alumni community.\n\nBeyond his alumni leadership responsibilities, John is actively involved in agribusiness, with a strong focus on poultry farming and sustainable agricultural practices. He is also passionate about technology and innovation, particularly in developing digital solutions that address challenges within the agricultural sector.\n\nWith a blend of leadership, entrepreneurship, and a commitment to service, John continues to contribute meaningfully to both the alumni community and society at large. His vision is to empower people, encourage collaboration, and drive initiatives that create lasting value and opportunities for growth.",
    category: "directors",
  },
  {
    id: "ezekwe-chidimma-cynthia",
    name: "Ezekwe Chidimma Cynthia",
    title: "Assistant Director, Mentorship and Student Relations",
    profession: "Metering Engineer | Petroleum & Gas Engineer",
    tenure: "2026 – 2028",
    image: Chidimma,
    rank: "19",
    shortBio:
      "Petroleum and Gas Engineer with experience in crude oil metering, custody transfer operations, hydrocarbon measurement, and production support.",
    fullBio:
      "Ezekwe Chidimma Cynthia is a Petroleum and Gas Engineer with practical experience in crude oil metering operations, hydrocarbon measurement systems, and custody transfer processes within the Nigerian oil and gas industry. She holds a Bachelor of Engineering (B.Eng.) degree in Petroleum and Gas Engineering from the Nigeria Maritime University.\n\nCurrently serving as a Metering Engineer with SeaQuest Upstream Service Limited, working on the Heirs Energy field, Chidimma is responsible for operating and maintaining LACT systems to ensure the accurate measurement and transfer of crude oil. A member of the Society of Petroleum Engineers (SPE), she is passionate about continuous learning, professional development, and contributing to safe and efficient energy operations.",
    category: "directors",
  },

   {
    id: "nneka-favour-agadi",
    name: "Nneka Favour Agadi",
    title: "Assistant Director for Education and Research",
    profession: "Marine Geology",
    tenure: "2026 – 2028",
    image: agadi,
    rank: "19",
    shortBio:
      `  Nneka Favour Agadi is a Graduate Research Assistant at the Kansas Geological Survey, University of Kansas, where she conducts research on the Dakota Aquifer System. Her research focuses on assessing depositional facies and developing a sequence stratigraphic framework to improve understanding of subsurface stratigraphic processes.
      She holds a bachelor’s degree in Marine Geology from Nigeria Maritime University, Okerenkoko, Delta State, Nigeria `,
    fullBio:
      `Nneka Favour Agadi is a Graduate Research Assistant at the Kansas Geological Survey (KGS), University of Kansas, where she is actively involved in geological research focused on the Dakota Aquifer System. Her research centers on the assessment and interpretation of depositional facies and the development of a sequence stratigraphic framework to enhance the understanding of subsurface stratigraphic architecture, depositional environments, and sedimentary processes. Through her work, she seeks to contribute to a better understanding of the geological history, stratigraphic relationships, and sedimentary evolution of the Dakota Aquifer System.
      Her research interests include sedimentology, stratigraphy, depositional systems, sequence stratigraphy, and subsurface geological characterization. She is particularly interested in understanding how variations in depositional environments and sedimentary processes influence the distribution, geometry, and characteristics of subsurface geological units. Her work involves examining stratigraphic successions and interpreting depositional patterns to establish a comprehensive framework that can support improved geological understanding and subsurface interpretation.
      Nneka holds a bachelor's degree in Marine Geology from Nigeria Maritime University, Okerenkoko, Delta State, Nigeria. Her academic background in marine geology provided her with a foundation in sedimentary processes, geological formations, and the interpretation of depositional environments, which continues to inform her current research interests.
      As an emerging geoscientist, she is passionate about advancing geological knowledge through research, scientific inquiry, and the application of sedimentological and stratigraphic concepts to subsurface studies. She is particularly interested in developing her expertise in sedimentology, sequence stratigraphy, and basin analysis while contributing to research that improves the understanding of aquifer systems and their geological frameworks. Her academic and research journey reflects her commitment to continuous learning, scientific discovery, and contributing to the broader geoscience community. ` ,
    category: "directors",
  },
  {
    id: "anuoluwapo-enitan-popoola",
    name: "Anuoluwapo Enitan Popoola",
    title: "Assistant Director of Communication and Media",
    profession: "Program Strategy & Execution | MERL",
    tenure: "2026 – 2028",
    image: anuoluwapo,
    rank: "20",
    shortBio:
      "Program strategy and execution support practitioner at Mastercard Foundation, with experience in MERL, impact delivery, data and insights, and stakeholder engagement. Marine Geology graduate of Nigeria Maritime University.",
    fullBio:
      "Anuoluwapo Enitan Popoola is a program strategy and execution support practitioner at Mastercard Foundation with experience in Monitoring, Evaluation, Research and Learning (MERL), impact delivery, data and insights generation, stakeholder engagement, and ecosystem intelligence.\n\nA graduate of Marine Geology from the Nigeria Maritime University, he has contributed to initiatives that leverage evidence, research, and learning to strengthen program effectiveness and drive measurable outcomes for young people across Africa. His work spans program performance tracking, strategic planning, knowledge generation, and cross-functional collaboration, translating insights into actionable solutions that inform decision-making and enhance impact.\n\nPassionate about youth empowerment, sustainable development, and continuous learning, he is committed to helping individuals and institutions unlock potential, achieve meaningful results, and create lasting positive change.",
    category: "directors",
  },

  // ===== 7. PROVOST MARSHAL =====
  {
    id: "kalu-raphael",
    name: "Kalu Raphael",
    title: "Provost Marshal",
    profession: "Marine Economics & Finance | Pioneer Set",
    tenure: "2026 – 2028",
    image: kalu,
    rank: "21",
    shortBio:
      "BSc in Marine Economics and Finance (pioneer set). Recipient of the NMU Most Disciplined Cadet Award. Currently serves as Provost Marshal.",
    fullBio:
      "I hold a BSc in Marine Economics and Finance and was part of the pioneer set. I received the NMU Most Disciplined Cadet Award for the pioneer set and currently volunteer as the NMU Alumni Provost Marshal.",
    category: "directors",
  },

  // ===== 8. GENERAL MEMBERS =====
  {
    id: "godwill-atonbrapaghafa-gloria",
    name: "Godwill Atonbrapaghafa Gloria",
    title: "Member",
    profession: "Marine Economics & Finance Graduate",
    tenure: "—",
    image: godwill,
    rank: "22",
    shortBio:
      "Graduate of Marine Economics and Finance with a passion for continuous learning and personal development.",
    fullBio:
      "My name is Gloria Godwill, a graduate of Marine Economics and Finance with a passion for continuous learning and personal development. I enjoy reading, acquiring new skills, and exploring opportunities for growth both personally and professionally.\nI recently completed my National Youth Service Corps (NYSC) program, which provided me with valuable experiences in leadership, teamwork, and community service. I am eager to build a successful career, make meaningful contributions in my field, and continue developing my knowledge and skills.\nI am excited to be part of this alumni community, reconnecting with old friends, sharing experiences, and creating opportunities for networking, collaboration, and growth.",
    category: "members",
  },
];

export const getMemberById = (id: string): MemberProfile | undefined =>
  allMembers.find((m) => m.id === id);

export const executives = allMembers.filter((m) => m.category === "executive");
export const directors = allMembers.filter((m) => m.category === "directors");
export const generalMembers = allMembers.filter(
  (m) => m.category === "members",
);

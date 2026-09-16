/**
 * German Life & Bureaucracy Abbreviations and Glossary
 * Highly practical definitions for expats, newcomers, and residents in Germany.
 */
const GERMAN_GLOSSARY = [
  {
    term: "Anmeldung",
    category: "bureaucracy",
    en: "Official residential registration at the local Citizens' Registration Office (Bürgeramt/Bürgerbüro). Legally mandatory within 14 days of moving into an apartment in Germany.",
    ko: "주소지 등록 (전입신고). 독일 입국/이사 후 14일 이내 관할 주민센터(Bürgeramt)에 의무적으로 신고해야 하며, 거주확인서(Wohnungsgeberbestätigung)가 필요합니다. 계좌 개설, 비자 발급의 필수 기초 서류입니다."
  },
  {
    term: "Abmeldung",
    category: "bureaucracy",
    en: "Official de-registration of your German address when permanently leaving Germany or surrendering a residence.",
    ko: "주소지 등록 말소 (전출신고). 독일을 완전히 떠나거나 영구 귀국할 때 Bürgeramt에서 진행하며, 통신사/헬스장/보험 위약금 없는 특별 해지(Sonderkündigung) 증빙으로 사용됩니다."
  },
  {
    term: "Wohnungsgeberbestätigung",
    category: "housing",
    en: "Landlord Confirmation form legally required from the landlord or main tenant confirming your move-in date for the Bürgeramt address registration.",
    ko: "집주인(임대인) 거주확인서. 전입신고(Anmeldung)를 위해 집주인이 서명해 주는 필수 서류로, 이사 날짜와 주소, 임대인 인적사항이 기재되어 있습니다."
  },
  {
    term: "Steuer-ID (Steueridentifikationsnummer)",
    category: "tax",
    en: "Permanent 11-digit Tax ID number automatically issued by the Federal Central Tax Office (BZSt) to every registered resident in Germany for life.",
    ko: "독일 개인 세금 식별번호. 전입신고 후 연방세무청(BZSt)에서 우편으로 자동 발송되는 평생 불변의 11자리 번호입니다. 회사 급여 처리 및 은행 계좌 개설 시 필수 제출 항목입니다."
  },
  {
    term: "Steuerklasse",
    category: "tax",
    en: "Income tax withholding bracket (Classes I to VI) determining monthly salary deductions based on marital status, children, and employment type.",
    ko: "소득세 등급 (1~6등급). 혼인 여부, 부양가족, 다중 고용 여부에 따라 매월 급여 원천징수 세율을 결정하는 등급 체계입니다."
  },
  {
    term: "ELSTER",
    category: "tax",
    en: "Electronic Tax Declaration platform (Elektronische Steuererklärung) provided by the German tax authority (Finanzamt) for filing annual tax returns online.",
    ko: "독일 국세청 온라인 전자세무 플랫폼(Elster). 한국의 홈택스에 해당하며, 온라인으로 소득세 연말정산(Steuererklärung) 신고 및 세금 등급 변경을 신청할 수 있습니다."
  },
  {
    term: "Finanzamt",
    category: "tax",
    en: "Local German tax office responsible for tax assessment, refunds, and issuing tax numbers.",
    ko: "독일 관할 세무서. 소득세 연말정산 서류를 심사하고 환급 또는 추징 결정을 내리는 세무 행정 기관입니다."
  },
  {
    term: "TK (Techniker Krankenkasse)",
    category: "health",
    en: "The largest statutory health insurance fund (Gesetzliche Krankenkasse - GKV) in Germany, popular among international professionals and students for English support.",
    ko: "테크니커 공보험. 독일 최대 규모의 법정 공보험사 중 하나로, 영문 지원 서비스가 잘 되어 있어 외국인 직장인과 유학생들이 가장 많이 가입하는 보험사입니다."
  },
  {
    term: "AOK (Allgemeine Ortskrankenkasse)",
    category: "health",
    en: "Major regional statutory health insurance organization in Germany operating across different federal states.",
    ko: "아오카 공보험. 독일 전역의 주별 지사를 두고 있는 대표적인 대형 공보험사 중 하나입니다."
  },
  {
    term: "GEZ / Rundfunkbeitrag",
    category: "housing",
    en: "Mandatory public broadcasting fee (€18.36 per month per household / apartment), regardless of whether you own a TV or radio.",
    ko: "독일 공영방송 수신료. 가구(아파트)당 월 18.36유로가 의무 부과되며, TV나 라디오 소유 여부와 무관하게 독일 내 모든 주거 가구가 납부해야 합니다."
  },
  {
    term: "Kaltmiete",
    category: "housing",
    en: "Cold Rent: the pure base rental cost of the living space excluding heating, warm water, and utility/operating charges.",
    ko: "순수 기본 월세 (차디찬 월세). 난방, 온수, 관리비(Nebenkosten)가 일체 포함되지 않은 순수 건물 공간 사용료입니다."
  },
  {
    term: "Warmmiete",
    category: "housing",
    en: "Warm Rent: Total monthly rent including Kaltmiete and estimated advance utility/operating prepayments (Nebenkosten). Electricity and internet are usually separate.",
    ko: "난방·관리비 포함 월세. 기본 월세(Kaltmiete)에 난방비, 청소비, 건물 보험 등 예상 관리비 선수금이 합산된 월세입니다. (전기세와 인터넷비는 통상 별도 계약)"
  },
  {
    term: "Nebenkosten",
    category: "housing",
    en: "Operating/utility costs paid monthly in advance (trash collection, building maintenance, heating, water, property tax). Reconciled annually in the Nebenkostenabrechnung.",
    ko: "주택 관리비/부대비용. 쓰레기 수거, 난방, 수도, 건물 청소비 등을 매월 선납하고, 연말에 실제 계량기 사용량을 정산(Abrechnung)하여 차액을 환급받거나 추가 납부합니다."
  },
  {
    term: "Kaution",
    category: "housing",
    en: "Rental deposit paid by tenant to the landlord as financial security. Legally capped at maximum 3 months' Kaltmiete (net cold rent) under BGB § 551.",
    ko: "임차 보증금. 세입자가 집주인에게 예치하는 담보금으로, 독일 민법(BGB)상 최대 순수 기본월세 3개월분(3 Kaltmieten)으로 엄격히 제한되며 3회 분할 납부가 가능합니다."
  },
  {
    term: "Schufa (Schufa-Auskunft)",
    category: "housing",
    en: "German credit rating report from Germany's dominant credit bureau. Landlords typically require a positive Schufa certificate (Bonitätsauskunft) before signing a rental lease.",
    ko: "슈파 신용조회서. 독일 개인 신용평가기관에서 발급하는 신용보고서로, 독일에서 아파트 임대 계약을 맺거나 휴대폰 개통, 대출 시 집주인이 필수적으로 요구합니다."
  },
  {
    term: "Haftpflichtversicherung",
    category: "everyday",
    en: "Private Third-Party Personal Liability Insurance. Highly recommended in Germany to protect against unintentional damages or bodily injuries caused to others.",
    ko: "개인 책임배상보험. 타인에게 실수로 입힌 신체 상해나 물건 파손(예: 열쇠 분실, 이웃집 누수, 자전거 접촉사고)을 무제한 보상해 주는 독일 생활 필수 1순위 민간 보험입니다."
  },
  {
    term: "Kfz (Kraftfahrzeug)",
    category: "transport",
    en: "German abbreviation for motor vehicle (car, motorcycle, van, truck).",
    ko: "자동차/차량 (모터비히클). 자동차 관련 서류(Kfz-Schein, Kfz-Steuer, Kfz-Versicherung)의 공통 접두어로 쓰입니다."
  },
  {
    term: "HU (Hauptuntersuchung)",
    category: "transport",
    en: "Mandatory regular technical vehicle inspection required every 24 months (36 months for brand-new cars) to verify roadworthiness.",
    ko: "정기 차량 기술 정밀검사. 자동차 도로 주행 적합성을 검증하기 위해 2년마다 의무적으로 받아야 하는 안전 검사입니다."
  },
  {
    term: "AU (Abgasuntersuchung)",
    category: "transport",
    en: "Mandatory exhaust emissions test for combustion engine vehicles, integrated into the regular HU inspection.",
    ko: "자동차 배출가스 검사. 내연기관 차량의 배기가스 기준치 충족 여부를 확인하는 검사로, HU 검사와 함께 통합 진행됩니다."
  },
  {
    term: "TÜV (Technischer Überwachungsverein)",
    category: "transport",
    en: "Technical Inspection Association. The most famous independent accredited testing body conducting vehicle HU inspections, industrial safety tests, and certifications.",
    ko: "튀프 (독일 기술검사협회). 차량 정기검사(HU)와 각종 공학·산업 안전 인증을 수행하는 독일 대표 공인 기술 검사 기관입니다."
  },
  {
    term: "Arbeitsvertrag",
    category: "work",
    en: "Employment contract specifying salary, working hours, notice period, vacation entitlement, and job responsibilities.",
    ko: "근로계약서. 급여, 주당 근무시간, 휴가일수, 수습기간, 해고 예고기간 등이 명시된 고용 계약 문서입니다."
  },
  {
    term: "Probezeit",
    category: "work",
    en: "Probationary period at the start of an employment contract, typically lasting up to 6 months. Shorter statutory notice period (usually 2 weeks) applies to both parties.",
    ko: "수습 기간 (시용 기간). 통상 입사 후 최대 6개월간 적용되며, 이 기간 동안은 노사 양측 모두 2주의 단축 예고기간(Notice period)으로 자유롭게 계약을 해지할 수 있습니다."
  },
  {
    term: "Kündigung / Kündigungsfrist",
    category: "work",
    en: "Termination / Notice period. German employment law provides strong worker protection (KSchG); notice periods are strictly governed by contract and law.",
    ko: "계약 해지 및 해고 예고기간. 독일 노동법은 해고 보호법(KSchG)을 통해 근로자를 강력히 보호하며, 법정 또는 계약상 명시된 예고기간을 엄격히 준수해야 합니다."
  },
  {
    term: "Kurzarbeit",
    category: "work",
    en: "Short-time work scheme where the state employment agency (Agentur für Arbeit) pays a subsidy (Kurzarbeitergeld) to cover lost wages during economic downturns.",
    ko: "단축근무 지원제도. 경제 위기나 경영난 시 기업이 직원을 해고하지 않고 근무시간을 줄이면 국가가 임금 손실분의 60~67%를 보전해 주는 고용유지 제도입니다."
  },
  {
    term: "Kindergeld",
    category: "family",
    en: "State child benefit paid monthly to parents in Germany (2026: €259 per child per month) until at least age 18, or 25 if pursuing university/vocational training.",
    ko: "독일 아동수당. 부모 소득과 무관하게 지급되는 자녀 양육 지원금 (2026년 기준: 자녀 1인당 월 259유로). 기본 만 18세, 학업·직업교육 중인 경우 만 25세까지 지급됩니다."
  },
  {
    term: "Elterngeld",
    category: "family",
    en: "Parental allowance replacing 65% of net income (capped at €1,800/month) for parents taking parental leave to care for a newborn infant.",
    ko: "부모수당 (육아휴직 급여). 출산 후 직접 육아를 전담하는 부모에게 기존 순수령액의 약 65%(월 최대 1,800유로)를 지급하는 정부 지원금입니다."
  },
  {
    term: "Kita (Kindertagesstätte)",
    category: "family",
    en: "Daycare center for young children (Kinderkrippe for under 3, Kindergarten for 3 to school age).",
    ko: "어린이집/유치원. 만 1세 이상 유아에게 법적 보육 권리가 주어지며, 크리페(Krippe, 0~3세)와 킨더가르텐(Kindergarten, 3~6세)으로 구분됩니다."
  },
  {
    term: "Schulpflicht",
    category: "family",
    en: "Mandatory compulsory school attendance for children between approximately ages 6 and 16. Homeschooling is generally illegal in Germany.",
    ko: "취학 의무 (의무교육). 만 6세부터 약 16세까지 모든 아동은 학교에 반드시 출석해야 하며, 독일에서는 홈스쿨링이 원칙적으로 법률상 금지되어 있습니다."
  },
  {
    term: "Ruhezeit",
    category: "housing",
    en: "Legally mandated quiet hours in apartment buildings (typically 22:00 to 07:00, and all day Sunday and public holidays). Excessive noise can lead to police or Hausordnung fines.",
    ko: "정숙 시간. 독일 아파트 및 주거지역에서 법적으로 지정된 휴식 시간대로(통상 평일 밤 10시~아침 7시, 일요일 및 공휴일 종일), 세탁기 소음이나 망치질, 악기 연주 등이 엄격히 금지됩니다."
  },
  {
    term: "Pfand (Einweg / Mehrweg)",
    category: "everyday",
    en: "Beverage bottle/can recycling deposit system (€0.25 for single-use plastic bottles & cans; €0.08–€0.15 for reusable glass bottles), refundable at supermarket reverse vending machines.",
    ko: "판트 (공병·캔 보증금 제도). 음료 구매 시 결제한 보증금(일회용 페트병·캔 0.25유로, 맥주 유리병 0.08~0.15유로)을 슈퍼마켓 자동 반환기에 넣고 영수증으로 환급받는 친환경 시스템입니다."
  },
  {
    term: "Apotheke",
    category: "health",
    en: "Licensed pharmacy. In Germany, only registered pharmacies may sell prescription and over-the-counter pharmaceuticals; supermarkets do not sell medicines.",
    ko: "약국. 독일에서는 빨간색 고딕체 'A' 간판을 사용하며, 일반 마트에서는 진통제조차 판매할 수 없고 오직 면허 약국(Apotheke)에서만 의약품 구매가 가능합니다."
  },
  {
    term: "Drogerie",
    category: "everyday",
    en: "Drugstore (such as dm, Rossmann, Müller) selling cosmetics, personal hygiene products, vitamins, baby supplies, and household goods, but not prescription medicines.",
    ko: "드럭스토어 (dm, Rossmann, Müller 등). 화장품, 생활용품, 아기용품, 영양제, 유기농 식품 등을 저렴하게 판매하는 독일의 필수 쇼핑 매장입니다."
  },
  {
    term: "Brutto vs Netto",
    category: "tax",
    en: "Gross (Brutto) is total earnings before taxes and statutory social insurances; Net (Netto) is the actual take-home pay transferred to your German bank account.",
    ko: "세전(Brutto) vs 세후(Netto). 브루토는 세금 및 4대 사회보험 공제 전의 총급여이며, 네토는 모든 공제 항목을 제하고 통장으로 입금되는 실제 순수령액입니다."
  },
  {
    term: "Schufa-Eintrag",
    category: "housing",
    en: "Negative credit record logged in your Schufa profile caused by unpaid bills, contract defaults, or bankruptcy, which severely hampers apartment renting and financing.",
    ko: "슈파 신용 불량 기록. 연체, 통신비 미납, 채무불이행 등으로 인해 신용 등급에 기록되는 오점으로, 한번 등재되면 독일 내 집 계약이나 카드 발급이 극도로 어려워집니다."
  },
  {
    term: "Warmwasser",
    category: "housing",
    en: "Hot water supply. Can be central (zentral via building boiler included in Nebenkosten) or decentralized (dezentral via electric Durchlauferhitzer added to electricity bill).",
    ko: "온수 공급. 중앙 공급(Zentral, 관리비 난방 항목에 포함) 방식과 개별 전기 순간온수기(Durchlauferhitzer, 개인 전기세로 부과) 방식으로 나뉩니다."
  },
  {
    term: "Einbauküche (EBK)",
    category: "housing",
    en: "Fitted kitchen. In Germany, many rental apartments are rented without a kitchen sink, counters, stove, or oven, unless explicitly marked 'mit Einbauküche'.",
    ko: "빌트인 주방(싱크대, 인덕션, 수납장 등). 독일 아파트는 주방 가구가 전혀 없이 콘크리트 벽과 배관만 있는 채로 임대되는 경우가 많으므로, 계약 시 EBK 포함 여부를 확인해야 합니다."
  },
  {
    term: "Umlagefähig / Betriebskosten",
    category: "housing",
    en: "Operating costs legally permitted to be passed from the landlord to the tenant according to the BetrKV (Betriebskostenverordnung).",
    ko: "세입자에게 전가 가능한 관리비 항목. 독일 관리비 규정에 따라 재산세, 승강기 유지비, 청소비, 제설비 등 임대인이 세입자에게 청구할 수 있는 법정 비용입니다."
  },
  {
    term: "Personalausweis / Aufenthaltstitel",
    category: "bureaucracy",
    en: "German National Identity Card / Electronic Residence Permit (eAT card) issued to foreign residents certifying legal residence and work authorization.",
    ko: "신분증 / 전자 체류허가증(거주증 eAT). 비유럽권 외국인의 합법적 거주 및 노동 허가(취업비자, 블루카드, 영주권)가 칩에 기록된 플라스틱 신분증 카드입니다."
  },
  {
    term: "Blaue Karte EU (Blue Card)",
    category: "work",
    en: "Special residence title for highly qualified university graduates and international professionals with simplified family reunification and fast-track permanent residency.",
    ko: "EU 블루카드. 고학력 전문직 외국인 인재를 유치하기 위한 취업비자로, 일정 연봉 이상을 충족하면 동반 가족 취업 허용 및 21~27개월 내 독일 영주권(Niederlassungserlaubnis) 조기 취득이 가능합니다."
  },
  {
    term: "Solidaritätszuschlag (SolZ)",
    category: "tax",
    en: "Solidarity Surcharge. Originally introduced to finance German reunification, now abolished for roughly 90% of taxpayers and only levied on high-income earners.",
    ko: "연대특별세 (통일세). 독일 통일 재건 비용을 위해 도입된 세금으로, 현재는 90% 이상의 일반 근로자에게 면제되며 일정 고소득자에게만 소득세의 최대 5.5%가 부과됩니다."
  }
];


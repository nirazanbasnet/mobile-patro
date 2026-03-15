export interface Festival {
	name: string;
	nameNp: string;
	type: "major" | "minor" | "government" | "cultural";
	hasParticles?: boolean;
	particleColor?: string;
	isPublicHoliday?: boolean;
}

export type FestivalMap = Record<string, Festival>;

function key(month: number, day: number): string {
	return `${month}-${day}`;
}

const FIXED_HOLIDAYS: FestivalMap = {
	[key(1, 1)]: {
		name: "Nepali New Year",
		nameNp: "नयाँ वर्ष",
		type: "major",
		hasParticles: true,
		particleColor: "#F5C542",
		isPublicHoliday: true,
	},
	[key(1, 18)]: {
		name: "International Labour Day",
		nameNp: "अन्तर्राष्ट्रिय श्रमिक दिवस",
		type: "government",
		isPublicHoliday: true,
	},
	[key(2, 15)]: {
		name: "Republic Day",
		nameNp: "गणतन्त्र दिवस",
		type: "government",
		isPublicHoliday: true,
	},
	[key(6, 3)]: {
		name: "Constitution Day",
		nameNp: "संविधान दिवस",
		type: "government",
		isPublicHoliday: true,
	},
	[key(10, 1)]: {
		name: "Maghe Sankranti",
		nameNp: "माघे संक्रान्ति",
		type: "major",
		isPublicHoliday: true,
	},
};

const VARIABLE_HOLIDAYS: Record<number, FestivalMap> = {
	2080: {
		[key(1, 22)]: {
			name: "Buddha Jayanti",
			nameNp: "बुद्ध जयन्ती",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 7)]: {
			name: "Janai Purnima",
			nameNp: "जनाई पूर्णिमा",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 8)]: {
			name: "Gaijatra",
			nameNp: "गाईजात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(5, 14)]: {
			name: "Krishna Janmashtami",
			nameNp: "कृष्ण जन्माष्टमी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 23)]: {
			name: "Haritalika Teej",
			nameNp: "हरितालिका तीज",
			type: "major",
			isPublicHoliday: true,
		},
		[key(6, 1)]: {
			name: "Indra Jatra",
			nameNp: "इन्द्र जात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(6, 28)]: {
			name: "Ghatasthapana",
			nameNp: "घटस्थापना",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 4)]: {
			name: "Fulpati",
			nameNp: "फूलपाती",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 5)]: {
			name: "Maha Ashtami",
			nameNp: "महाअष्टमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 6)]: {
			name: "Maha Navami",
			nameNp: "महानवमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 7)]: {
			name: "Vijaya Dashami",
			nameNp: "विजया दशमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 8)]: {
			name: "Ekadashi",
			nameNp: "एकादशी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(7, 9)]: {
			name: "Dwadashi",
			nameNp: "द्वादशी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(7, 26)]: {
			name: "Laxmi Puja",
			nameNp: "लक्ष्मी पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 27)]: {
			name: "Gai Puja / Mha Puja",
			nameNp: "गाई पूजा / म्ह पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 28)]: {
			name: "Govardhan Puja",
			nameNp: "गोवर्धन पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 29)]: {
			name: "Bhai Tika",
			nameNp: "भाइ टीका",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(8, 3)]: {
			name: "Chhath Parva",
			nameNp: "छठ पर्व",
			type: "major",
			isPublicHoliday: true,
		},
		[key(9, 10)]: { name: "Christmas", nameNp: "क्रिसमस", type: "cultural" },
		[key(9, 27)]: {
			name: "Prithvi Jayanti",
			nameNp: "पृथ्वी जयन्ती",
			type: "government",
		},
		[key(10, 16)]: {
			name: "Martyrs' Day",
			nameNp: "शहीद दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 7)]: {
			name: "Democracy Day",
			nameNp: "प्रजातन्त्र दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 25)]: {
			name: "Maha Shivaratri",
			nameNp: "महाशिवरात्रि",
			type: "major",
			isPublicHoliday: true,
		},
		[key(11, 26)]: {
			name: "Fagu Purnima (Holi)",
			nameNp: "फागु पूर्णिमा (होली)",
			type: "major",
			hasParticles: true,
			particleColor: "#FF69B4",
			isPublicHoliday: true,
		},
		[key(12, 11)]: {
			name: "Ghode Jatra",
			nameNp: "घोडे जात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(12, 26)]: {
			name: "Ram Navami",
			nameNp: "राम नवमी",
			type: "major",
			isPublicHoliday: true,
		},
	},

	2081: {
		[key(1, 5)]: {
			name: "Ram Navami",
			nameNp: "राम नवमी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(2, 10)]: {
			name: "Buddha Jayanti",
			nameNp: "बुद्ध जयन्ती",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 3)]: {
			name: "Janai Purnima",
			nameNp: "जनाई पूर्णिमा / रक्षा बन्धन",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 4)]: {
			name: "Gaijatra",
			nameNp: "गाईजात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(5, 10)]: {
			name: "Krishna Janmashtami",
			nameNp: "कृष्ण जन्माष्टमी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 20)]: {
			name: "Haritalika Teej",
			nameNp: "हरितालिका तीज",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 27)]: {
			name: "Indra Jatra",
			nameNp: "इन्द्र जात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(6, 17)]: {
			name: "Ghatasthapana",
			nameNp: "घटस्थापना",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 24)]: {
			name: "Fulpati",
			nameNp: "फूलपाती",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 25)]: {
			name: "Maha Ashtami",
			nameNp: "महाअष्टमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 26)]: {
			name: "Maha Navami",
			nameNp: "महानवमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 27)]: {
			name: "Vijaya Dashami",
			nameNp: "विजया दशमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 28)]: {
			name: "Ekadashi",
			nameNp: "एकादशी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(6, 29)]: {
			name: "Dwadashi",
			nameNp: "द्वादशी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(7, 15)]: {
			name: "Laxmi Puja",
			nameNp: "लक्ष्मी पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 16)]: {
			name: "Govardhan Puja",
			nameNp: "गोवर्धन पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 17)]: {
			name: "Mha Puja",
			nameNp: "म्ह पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 18)]: {
			name: "Bhai Tika",
			nameNp: "भाइ टीका",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 22)]: {
			name: "Chhath Parva",
			nameNp: "छठ पर्व",
			type: "major",
			isPublicHoliday: true,
		},
		[key(8, 30)]: {
			name: "Yomari Punhi",
			nameNp: "योमरी पुन्ही",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(9, 10)]: { name: "Christmas", nameNp: "क्रिसमस", type: "cultural" },
		[key(9, 15)]: {
			name: "Tamu Lhosar",
			nameNp: "तमु ल्होसार",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(9, 27)]: {
			name: "Prithvi Jayanti",
			nameNp: "पृथ्वी जयन्ती",
			type: "government",
		},
		[key(10, 8)]: {
			name: "Sonam Lhosar",
			nameNp: "सोनाम ल्होसार",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(10, 16)]: {
			name: "Martyrs' Day",
			nameNp: "शहीद दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(10, 18)]: {
			name: "Saraswati Puja",
			nameNp: "सरस्वती पूजा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(11, 7)]: {
			name: "Democracy Day",
			nameNp: "प्रजातन्त्र दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 14)]: {
			name: "Maha Shivaratri",
			nameNp: "महाशिवरात्रि",
			type: "major",
			isPublicHoliday: true,
		},
		[key(12, 1)]: {
			name: "Fagu Purnima (Holi)",
			nameNp: "फागु पूर्णिमा (होली)",
			type: "major",
			hasParticles: true,
			particleColor: "#FF69B4",
			isPublicHoliday: true,
		},
		[key(12, 11)]: {
			name: "Ghode Jatra",
			nameNp: "घोडे जात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
	},

	2082: {
		[key(1, 29)]: {
			name: "Buddha Jayanti",
			nameNp: "बुद्ध जयन्ती / उभौली पर्व",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 24)]: {
			name: "Janai Purnima",
			nameNp: "जनाई पूर्णिमा / रक्षा बन्धन",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 25)]: {
			name: "Gaijatra",
			nameNp: "गाईजात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(4, 31)]: {
			name: "Krishna Janmashtami",
			nameNp: "कृष्ण जन्माष्टमी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 10)]: {
			name: "Haritalika Teej",
			nameNp: "हरितालिका तीज",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 15)]: {
			name: "Gaura Parva",
			nameNp: "गौरा पर्व",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(5, 21)]: {
			name: "Indra Jatra",
			nameNp: "इन्द्र जात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(5, 27)]: {
			name: "Jitiya Parva",
			nameNp: "जितिया पर्व",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(6, 6)]: {
			name: "Ghatasthapana",
			nameNp: "घटस्थापना",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 13)]: {
			name: "Fulpati",
			nameNp: "फूलपाती",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 14)]: {
			name: "Maha Ashtami",
			nameNp: "महाअष्टमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 15)]: {
			name: "Maha Navami",
			nameNp: "महानवमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 16)]: {
			name: "Vijaya Dashami",
			nameNp: "विजया दशमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 17)]: {
			name: "Ekadashi",
			nameNp: "एकादशी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(6, 18)]: {
			name: "Dwadashi",
			nameNp: "द्वादशी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(6, 20)]: {
			name: "Kojagrat Purnima",
			nameNp: "कोजाग्रत पूर्णिमा",
			type: "minor",
		},
		[key(7, 3)]: {
			name: "Laxmi Puja",
			nameNp: "लक्ष्मी पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 4)]: {
			name: "Gai Puja / Kukur Tihar",
			nameNp: "गाई पूजा / कुकुर तिहार",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 5)]: {
			name: "Govardhan Puja",
			nameNp: "गोवर्धन पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 6)]: {
			name: "Bhai Tika",
			nameNp: "भाइ टीका",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 7)]: {
			name: "Tihar Holiday",
			nameNp: "तिहार बिदा",
			type: "major",
			isPublicHoliday: true,
		},
		[key(7, 13)]: {
			name: "Chhath Parva",
			nameNp: "छठ पर्व",
			type: "major",
			isPublicHoliday: true,
		},
		[key(8, 15)]: {
			name: "Yomari Punhi",
			nameNp: "योमरी पुन्ही / धन्य पूर्णिमा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(9, 10)]: { name: "Christmas", nameNp: "क्रिसमस", type: "cultural" },
		[key(9, 12)]: {
			name: "Tamu Lhosar",
			nameNp: "तमु ल्होसार",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(9, 27)]: {
			name: "Prithvi Jayanti",
			nameNp: "पृथ्वी जयन्ती",
			type: "government",
		},
		[key(10, 8)]: {
			name: "Sonam Lhosar",
			nameNp: "सोनाम ल्होसार",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(10, 16)]: {
			name: "Martyrs' Day",
			nameNp: "शहीद दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(10, 18)]: {
			name: "Saraswati Puja",
			nameNp: "सरस्वती पूजा / श्री पञ्चमी",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(11, 5)]: {
			name: "Maha Shivaratri",
			nameNp: "महाशिवरात्रि",
			type: "major",
			isPublicHoliday: true,
		},
		[key(11, 7)]: {
			name: "Democracy Day",
			nameNp: "प्रजातन्त्र दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 11)]: {
			name: "Gyalpo Lhosar",
			nameNp: "ग्याल्पो ल्होसार",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(11, 26)]: {
			name: "Fagu Purnima (Holi)",
			nameNp: "फागु पूर्णिमा (होली) - तराई",
			type: "major",
			hasParticles: true,
			particleColor: "#FF69B4",
			isPublicHoliday: true,
		},
		[key(11, 27)]: {
			name: "Fagu Purnima (Holi)",
			nameNp: "फागु पूर्णिमा (होली) - पहाड",
			type: "major",
			hasParticles: true,
			particleColor: "#FF69B4",
			isPublicHoliday: true,
		},
		[key(12, 8)]: {
			name: "Ghode Jatra",
			nameNp: "घोडे जात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(12, 20)]: {
			name: "Ram Navami",
			nameNp: "राम नवमी",
			type: "major",
			isPublicHoliday: true,
		},
	},

	2083: {
		[key(1, 19)]: {
			name: "Buddha Jayanti",
			nameNp: "बुद्ध जयन्ती",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 14)]: {
			name: "Janai Purnima",
			nameNp: "जनाई पूर्णिमा / रक्षा बन्धन",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 15)]: {
			name: "Gaijatra",
			nameNp: "गाईजात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(4, 21)]: {
			name: "Krishna Janmashtami",
			nameNp: "कृष्ण जन्माष्टमी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 32)]: {
			name: "Haritalika Teej",
			nameNp: "हरितालिका तीज",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 11)]: {
			name: "Indra Jatra",
			nameNp: "इन्द्र जात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(6, 23)]: {
			name: "Ghatasthapana",
			nameNp: "घटस्थापना",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 30)]: {
			name: "Fulpati",
			nameNp: "फूलपाती",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 1)]: {
			name: "Maha Ashtami",
			nameNp: "महाअष्टमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 2)]: {
			name: "Maha Navami",
			nameNp: "महानवमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 3)]: {
			name: "Vijaya Dashami",
			nameNp: "विजया दशमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 4)]: {
			name: "Ekadashi",
			nameNp: "एकादशी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(7, 5)]: {
			name: "Dwadashi",
			nameNp: "द्वादशी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(7, 22)]: {
			name: "Laxmi Puja",
			nameNp: "लक्ष्मी पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 23)]: {
			name: "Gai Puja",
			nameNp: "गाई पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 24)]: {
			name: "Govardhan Puja",
			nameNp: "गोवर्धन पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 25)]: {
			name: "Bhai Tika",
			nameNp: "भाइ टीका",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 30)]: {
			name: "Chhath Parva",
			nameNp: "छठ पर्व",
			type: "major",
			isPublicHoliday: true,
		},
		[key(9, 10)]: { name: "Christmas", nameNp: "क्रिसमस", type: "cultural" },
		[key(9, 27)]: {
			name: "Prithvi Jayanti",
			nameNp: "पृथ्वी जयन्ती",
			type: "government",
		},
		[key(10, 16)]: {
			name: "Martyrs' Day",
			nameNp: "शहीद दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 7)]: {
			name: "Democracy Day",
			nameNp: "प्रजातन्त्र दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 9)]: {
			name: "Maha Shivaratri",
			nameNp: "महाशिवरात्रि",
			type: "major",
			isPublicHoliday: true,
		},
		[key(11, 30)]: {
			name: "Fagu Purnima (Holi)",
			nameNp: "फागु पूर्णिमा (होली)",
			type: "major",
			hasParticles: true,
			particleColor: "#FF69B4",
			isPublicHoliday: true,
		},
		[key(12, 1)]: {
			name: "Fagu Purnima (Holi)",
			nameNp: "फागु पूर्णिमा (होली) - तराई",
			type: "major",
			hasParticles: true,
			particleColor: "#FF69B4",
			isPublicHoliday: true,
		},
		[key(12, 10)]: {
			name: "Ram Navami",
			nameNp: "राम नवमी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(12, 15)]: {
			name: "Ghode Jatra",
			nameNp: "घोडे जात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
	},

	2084: {
		[key(1, 8)]: {
			name: "Buddha Jayanti",
			nameNp: "बुद्ध जयन्ती",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 4)]: {
			name: "Janai Purnima",
			nameNp: "जनाई पूर्णिमा",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 10)]: {
			name: "Krishna Janmashtami",
			nameNp: "कृष्ण जन्माष्टमी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 22)]: {
			name: "Haritalika Teej",
			nameNp: "हरितालिका तीज",
			type: "major",
			isPublicHoliday: true,
		},
		[key(6, 12)]: {
			name: "Ghatasthapana",
			nameNp: "घटस्थापना",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 19)]: {
			name: "Fulpati",
			nameNp: "फूलपाती",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 20)]: {
			name: "Maha Ashtami",
			nameNp: "महाअष्टमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 21)]: {
			name: "Maha Navami",
			nameNp: "महानवमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 22)]: {
			name: "Vijaya Dashami",
			nameNp: "विजया दशमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 11)]: {
			name: "Laxmi Puja",
			nameNp: "लक्ष्मी पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 12)]: {
			name: "Gai Puja",
			nameNp: "गाई पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 13)]: {
			name: "Govardhan Puja",
			nameNp: "गोवर्धन पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 14)]: {
			name: "Bhai Tika",
			nameNp: "भाइ टीका",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 20)]: {
			name: "Chhath Parva",
			nameNp: "छठ पर्व",
			type: "major",
			isPublicHoliday: true,
		},
		[key(9, 10)]: { name: "Christmas", nameNp: "क्रिसमस", type: "cultural" },
		[key(9, 27)]: {
			name: "Prithvi Jayanti",
			nameNp: "पृथ्वी जयन्ती",
			type: "government",
		},
		[key(10, 16)]: {
			name: "Martyrs' Day",
			nameNp: "शहीद दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 3)]: {
			name: "Maha Shivaratri",
			nameNp: "महाशिवरात्रि",
			type: "major",
			isPublicHoliday: true,
		},
		[key(11, 7)]: {
			name: "Democracy Day",
			nameNp: "प्रजातन्त्र दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 18)]: {
			name: "Fagu Purnima (Holi)",
			nameNp: "फागु पूर्णिमा (होली)",
			type: "major",
			hasParticles: true,
			particleColor: "#FF69B4",
			isPublicHoliday: true,
		},
		[key(12, 1)]: {
			name: "Ghode Jatra",
			nameNp: "घोडे जात्रा",
			type: "cultural",
			isPublicHoliday: true,
		},
		[key(12, 29)]: {
			name: "Ram Navami",
			nameNp: "राम नवमी",
			type: "major",
			isPublicHoliday: true,
		},
	},

	2085: {
		[key(1, 27)]: {
			name: "Buddha Jayanti",
			nameNp: "बुद्ध जयन्ती",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 23)]: {
			name: "Janai Purnima",
			nameNp: "जनाई पूर्णिमा",
			type: "major",
			isPublicHoliday: true,
		},
		[key(4, 30)]: {
			name: "Krishna Janmashtami",
			nameNp: "कृष्ण जन्माष्टमी",
			type: "major",
			isPublicHoliday: true,
		},
		[key(5, 10)]: {
			name: "Haritalika Teej",
			nameNp: "हरितालिका तीज",
			type: "major",
			isPublicHoliday: true,
		},
		[key(6, 2)]: {
			name: "Ghatasthapana",
			nameNp: "घटस्थापना",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 9)]: {
			name: "Fulpati",
			nameNp: "फूलपाती",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 10)]: {
			name: "Maha Ashtami",
			nameNp: "महाअष्टमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 11)]: {
			name: "Maha Navami",
			nameNp: "महानवमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(6, 12)]: {
			name: "Vijaya Dashami",
			nameNp: "विजया दशमी",
			type: "major",
			hasParticles: true,
			particleColor: "#F5C542",
			isPublicHoliday: true,
		},
		[key(7, 1)]: {
			name: "Laxmi Puja",
			nameNp: "लक्ष्मी पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 2)]: {
			name: "Gai Puja",
			nameNp: "गाई पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 3)]: {
			name: "Govardhan Puja",
			nameNp: "गोवर्धन पूजा",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 4)]: {
			name: "Bhai Tika",
			nameNp: "भाइ टीका",
			type: "major",
			hasParticles: true,
			particleColor: "#FFD700",
			isPublicHoliday: true,
		},
		[key(7, 10)]: {
			name: "Chhath Parva",
			nameNp: "छठ पर्व",
			type: "major",
			isPublicHoliday: true,
		},
		[key(9, 10)]: { name: "Christmas", nameNp: "क्रिसमस", type: "cultural" },
		[key(10, 16)]: {
			name: "Martyrs' Day",
			nameNp: "शहीद दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 7)]: {
			name: "Democracy Day",
			nameNp: "प्रजातन्त्र दिवस",
			type: "government",
			isPublicHoliday: true,
		},
		[key(11, 22)]: {
			name: "Maha Shivaratri",
			nameNp: "महाशिवरात्रि",
			type: "major",
			isPublicHoliday: true,
		},
		[key(12, 7)]: {
			name: "Fagu Purnima (Holi)",
			nameNp: "फागु पूर्णिमा (होली)",
			type: "major",
			hasParticles: true,
			particleColor: "#FF69B4",
			isPublicHoliday: true,
		},
		[key(12, 18)]: {
			name: "Ram Navami",
			nameNp: "राम नवमी",
			type: "major",
			isPublicHoliday: true,
		},
	},
};

function getMergedFestivalsForYear(bsYear: number): FestivalMap {
	const yearSpecific = VARIABLE_HOLIDAYS[bsYear] ?? {};

	const fixedWithYear: FestivalMap = {};
	for (const [k, v] of Object.entries(FIXED_HOLIDAYS)) {
		if (k === "1-1") {
			fixedWithYear[k] = {
				...v,
				nameNp: `नयाँ वर्ष ${bsYear}`,
			};
		} else {
			fixedWithYear[k] = v;
		}
	}

	return { ...fixedWithYear, ...yearSpecific };
}

export function getFestival(
	bsYear: number,
	bsMonth: number,
	bsDay: number,
): Festival | null {
	const merged = getMergedFestivalsForYear(bsYear);
	const k = key(bsMonth, bsDay);
	return merged[k] ?? null;
}

export function getFestivalsForMonth(
	bsYear: number,
	bsMonth: number,
): Array<{ day: number; festival: Festival }> {
	const merged = getMergedFestivalsForYear(bsYear);
	const results: Array<{ day: number; festival: Festival }> = [];

	for (const [k, festival] of Object.entries(merged)) {
		const [m, d] = k.split("-").map(Number);
		if (m === bsMonth) {
			results.push({ day: d, festival });
		}
	}

	return results.sort((a, b) => a.day - b.day);
}

export function isMajorFestival(
	bsYear: number,
	bsMonth: number,
	bsDay: number,
): boolean {
	const festival = getFestival(bsYear, bsMonth, bsDay);
	return festival?.type === "major" && (festival.hasParticles ?? false);
}

export function getUpcomingFestivals(
	bsYear: number,
	bsMonth: number,
	bsDay: number,
	count: number = 5,
): Array<{ month: number; day: number; festival: Festival }> {
	const merged = getMergedFestivalsForYear(bsYear);
	const results: Array<{ month: number; day: number; festival: Festival }> = [];

	for (const [k, festival] of Object.entries(merged)) {
		const [m, d] = k.split("-").map(Number);
		if (m > bsMonth || (m === bsMonth && d > bsDay)) {
			results.push({ month: m, day: d, festival });
		}
	}

	results.sort((a, b) => a.month - b.month || a.day - b.day);
	return results.slice(0, count);
}

export function getFestivalsForYear(
	bsYear: number,
): Array<{ month: number; day: number; festival: Festival }> {
	const merged = getMergedFestivalsForYear(bsYear);
	const results: Array<{ month: number; day: number; festival: Festival }> = [];

	for (const [k, festival] of Object.entries(merged)) {
		const [m, d] = k.split("-").map(Number);
		results.push({ month: m, day: d, festival });
	}

	return results.sort((a, b) => a.month - b.month || a.day - b.day);
}

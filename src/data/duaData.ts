export interface DuaCategory {
    id: string;
    title: string;
    icon: string;
}

export interface Dua {
    id: number;
    categoryId: string;
    title: string;
    arabic: string;
    transliteration: string;
    translation: string;
    reference: string;
}

export const duaCategories: DuaCategory[] = [
    { id: 'morning', title: 'Morning', icon: 'Sun' },
    { id: 'evening', title: 'Evening', icon: 'Moon' },
    { id: 'prayer', title: 'Prayer', icon: 'Layout' },
    { id: 'travel', title: 'Travel', icon: 'Car' },
    { id: 'daily', title: 'Daily Life', icon: 'Home' },
];

export const duas: Dua[] = [
    {
        id: 1,
        categoryId: 'morning',
        title: 'Upon Waking Up',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'Alhamdu lillahil-lathee ahyana ba\'da ma amatana wa-ilayhin-nushoor.',
        translation: 'All praise is due to Allah who gave us life after having given us death and unto Him is the resurrection.',
        reference: 'Bukhari, Muslim'
    },
    {
        id: 2,
        categoryId: 'morning',
        title: 'Morning Adhkar',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
        transliteration: 'Asbahna wa-asbahal-mulku lillaah, walhamdu lillaah, laa ilaaha illallaahu wahdahu laa shareeka lah.',
        translation: 'We have entered the morning and at this very time the whole kingdom belongs to Allah, and all praise is due to Allah. There is none worthy of worship but Allah, alone, without partner.',
        reference: 'Muslim'
    },
    {
        id: 3,
        categoryId: 'prayer',
        title: 'Entering the Mosque',
        arabic: 'بِسْمِ اللَّهِ، وَالسَّلاَمُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي وَافْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        transliteration: 'Bismillaah, wassalaamu \'alaa rasoolillaah, Allaahummagh-fir lee dhunoobee waftah lee abwaaba rahmatik.',
        translation: 'In the name of Allah, and peace be upon the Messenger of Allah. O Allah, forgive me my sins and open the doors of Your mercy for me.',
        reference: 'Ibn Majah'
    },
    {
        id: 4,
        categoryId: 'travel',
        title: 'Dua for Travel',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        transliteration: 'Subhanal-lathee sakh-khara lana hatha wama kunna lahu muqrineen. Wa-inna ila rabbina lamunqaliboon.',
        translation: 'Glory unto Him Who created this transportation, for us, though we were unable to create it on our own. And unto our Lord we shall return.',
        reference: 'Quran 43:13-14'
    },
    {
        id: 5,
        categoryId: 'daily',
        title: 'Before Eating',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        translation: 'In the name of Allah.',
        reference: 'Bukhari'
    },
    {
        id: 6,
        categoryId: 'daily',
        title: 'After Eating',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِّنِّي وَلَا قُوَّةٍ',
        transliteration: 'Alhamdu lillahil-ladhi at\'amani hadha wa razaqanihi min ghayri fawlin minni wa la quwwah.',
        translation: 'All praise is due to Allah Who has fed me this and provided it for me without any might or power on my part.',
        reference: 'Tirmidhi'
    }
];

// lib/eventData.js
export const events = [
  {
    id: 1,
    title: 'رحلة الموسيقى الإلكترونية',
    artist: 'دي جي كوزميك',
    date: '25-11-2023',
    time: '22:00',
    venue: 'نادي بالس',
    city: 'الرياض',
    image: '/images/2.webp',

    price: 59.99,
    description:
      'استمتع برحلة موسيقية إلكترونية مع دي جي كوزميك، التي ستأخذك في رحلة عبر عالم من الإيقاعات والأنغام.',
    tickets: {
      vip: {
        price: 149.99,
        available: 50
      },
      standard: {
        price: 59.99,
        available: 200
      },
      early: {
        price: 39.99,
        available: 30
      }
    }
  },
  {
    id: 2,
    title: 'ثورة الروك',
    artist: 'ثاندر ستريك',
    date: '05-12-2023',
    time: '20:30',
    venue: 'ملعب الساحة',
    city: 'جدة',
    image: '/images/2.webp',
    price: 79.99,
    description:
      'تقدم فرقة ثاندر ستريك عرضًا موسيقيًا مذهلًا في جدة. استعد لليلة من عزف الجيتار والأصوات القوية!',
    tickets: {
      vip: {
        price: 179.99,
        available: 40
      },
      standard: {
        price: 79.99,
        available: 300
      },
      early: {
        price: 59.99,
        available: 0
      }
    }
  },
  {
    id: 3,
    title: 'ليالي الجاز',
    artist: 'فرقة سموث كوارتيت',
    date: '15-12-2023',
    time: '19:00',
    venue: 'نادي النوتة الزرقاء',
    city: 'دبي',
    image: '/images/2.webp',
    price: 45.99,
    description:
      'أمسية راقية من موسيقى الجاز الكلاسيكية والارتجال مع فرقة سموث كوارتيت. باقات النبيذ والعشاء متوفرة.',
    tickets: {
      vip: {
        price: 99.99,
        available: 30
      },
      standard: {
        price: 45.99,
        available: 150
      },
      early: {
        price: 35.99,
        available: 20
      }
    }
  },
  {
    id: 4,
    title: 'قمة الهيب هوب',
    artist: 'إم سي فلو وأصدقاء',
    date: '20-12-2023',
    time: '21:00',
    venue: 'قاعة أوربان',
    city: 'القاهرة',
    image: '/images/2.webp',
    price: 65.99,
    description:
      'أكبر حدث للهيب هوب هذا العام مع إم سي فلو وضيوف خاصين. لا تفوت هذه الليلة الملحمية من الإيقاعات والقوافي!',
    tickets: {
      vip: {
        price: 159.99,
        available: 60
      },
      standard: {
        price: 65.99,
        available: 250
      },
      early: {
        price: 49.99,
        available: 10
      }
    }
  },
  {
    id: 5,
    title: 'مهرجان البوب',
    artist: 'ملكات النغم',
    date: '10-01-2024',
    time: '19:30',
    venue: 'المسرح الكبير',
    city: 'أبو ظبي',
    image: '/images/2.webp',
    price: 89.99,
    description:
      'تقدم ملكات النغم المتصدرات للمخططات عرضًا مذهلاً مع تصميم رقصات مبهر وأداء صوتي رائع.',
    tickets: {
      vip: {
        price: 199.99,
        available: 45
      },
      standard: {
        price: 89.99,
        available: 350
      },
      early: {
        price: 69.99,
        available: 0
      }
    }
  },
  {
    id: 6,
    title: 'عرض الإندي',
    artist: 'مجموعة فايبرانت',
    date: '20-01-2024',
    time: '20:00',
    venue: 'صالة أكوستيك',
    city: 'بيروت',
    image: '/images/2.webp',

    price: 35.99,
    description:
      'اكتشف أفضل المواهب الناشئة في الموسيقى المستقلة مع مجموعة فايبرانت. ليلة حميمة من الموسيقى الأصيلة ورواية القصص.',
    tickets: {
      vip: {
        price: 75.99,
        available: 25
      },
      standard: {
        price: 35.99,
        available: 100
      },
      early: {
        price: 25.99,
        available: 15
      }
    }
  }
];

export function getEventById(id) {
  return events.find((event) => event.id === Number(id));
}

// All copy and facts in one place. Edit here, not in the components.

declare const __ART__: string[];
const has = (f: string) => (__ART__ || []).includes(f);
const opt = (f: string) => (has(f) ? `./images/${f}` : '');

export const IMG = {
  couple1: './images/couple-1.jpg', // foreheads touching (hero, moments)
  couple2: './images/couple-2.jpg', // forehead kiss (moments, finale)
  // Optional generated art. If a file is missing, the site falls back to drawn versions.
  paper: opt('envelope-paper.jpg'),
  seal: opt('wax-seal.png'),
  liner: opt('envelope-liner.jpg'),
  arch: opt('arch-frame.png'),
  haldi: opt('event-haldi.jpg'),
  vivah: opt('event-vivah.jpg'),
  vidaai: opt('event-vidaai.jpg'),
};

export const WEDDING_START_UTC = Date.UTC(2026, 10, 23, 11, 30); // 23 Nov 2026, 5:00 PM IST

export const bride = {
  name: 'Ritu',
  hindi: 'सौ.कां. रीतु केसरवानी',
  lines: ['Daughter of Shri Harishchandra Shivprasad Kesarwani (Lala)', 'Granddaughter of Late Shri Shivprasad Jagannath Kesarwani'],
};

export const groom = {
  name: 'Suraj',
  hindi: 'चि. सूरज केसरवानी',
  lines: ['Son of Shri Ashok Kesarwani', 'Grandson of Shri Rajaram Kesarwani', 'Native place: Kayasth Tola, Prahlad Ghat, Varanasi'],
};

const HALL_Q = 'Uttar+Bhavan+Hall+Uttar+Bhartiya+Seva+Sangh+Teachers+Colony+Road+BKC+Bandra+East+Mumbai+400051';
const HOME_Q = 'Shantinath+Bhavan+Dr+Babasaheb+Ambedkar+Road+Matunga+East+Mumbai+400019';

export const events = [
  {
    key: 'haldi', day: '22', dow: 'Sunday', title: 'Haldi & Mehendi', hindi: 'हल्दी • मेहंदी',
    time: '8:00 AM to 10:00 PM', note: 'With all the wedding rituals',
    place: 'Room No. 48, Shantinath Bhavan, Matunga East',
    map: `https://www.google.com/maps/search/?api=1&query=${HOME_Q}`,
    cal: ['20261122T080000', '20261122T220000'],
  },
  {
    key: 'vivah', day: '23', dow: 'Monday', title: 'Shubh Vivah', hindi: 'शुभ विवाह',
    time: '5:00 PM, through the night', note: 'Baraat arrival and Panigrahan, until 7:00 AM on 24 November',
    place: 'Uttar Bhavan Hall, BKC',
    map: `https://www.google.com/maps/search/?api=1&query=${HALL_Q}`,
    cal: ['20261123T170000', '20261124T070000'],
  },
  {
    key: 'vidaai', day: '24', dow: 'Tuesday', title: 'Vidaai', hindi: 'विदाई',
    time: '7:00 AM', note: 'Farewell to the bride',
    place: 'Uttar Bhavan Hall, BKC',
    map: `https://www.google.com/maps/search/?api=1&query=${HALL_Q}`,
    cal: ['20261124T070000', '20261124T090000'],
  },
] as const;

export const venue = {
  name: 'Uttar Bhavan Hall',
  address: 'Uttar Bhartiya Seva Sangh, Teachers Colony Road, Bandra Kurla Complex, Bandra East, Mumbai 400051',
  near: 'Closest station: Bandra Colony Underground Metro, BKC',
  directions: `https://www.google.com/maps/dir/?api=1&destination=${HALL_Q}`,
};

export const homes = [
  { title: "The bride's home", hindi: 'कन्या पक्ष', lines: ['Flat 48, Ground Floor, Building 02, Shantinath Bhavan, Dr. Babasaheb Ambedkar Road, Matunga East, Mumbai 400019', 'Near Shishu Van School'] },
  { title: "The groom's home", hindi: 'वर पक्ष', lines: ['Flat 703, 3A, Green Hill Building No. 3 CHS Ltd, Lokhandwala Township, Akurli Road, Kandivali East, Mumbai 400101', 'Village: Kayasth Tola, Prahlad Ghat, Varanasi 221001'] },
];

export const hosts = {
  by: 'Shri Harishchandra Shivprasad Kesarwani (Lala)',
  awaiting: 'Rohit Harishchandra Kesarwani (Janu), Jawaharlal Jagannath Kesarwani',
};

export function gcal(title: string, start: string, end: string, location: string, details: string) {
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
    '&dates=' + start + '/' + end + '&ctz=Asia/Kolkata&location=' + encodeURIComponent(location) + '&details=' + encodeURIComponent(details);
}

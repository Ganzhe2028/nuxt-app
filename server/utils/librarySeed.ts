import type {
  CreateBookInput,
  CreateLoanInput,
  CreateMemberInput,
} from '~/types/library'

export const seedBooks: CreateBookInput[] = [
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    category: 'Technology',
    level: 'Teachers',
    status: 'on-loan',
    summary:
      'Timeless lessons for software craftsmanship and continuous improvement.',
  },
  {
    title: "Charlotte's Web",
    author: 'E. B. White',
    category: 'Fiction',
    level: 'Grades 3-4',
    status: 'available',
    summary:
      'A heartwarming story about friendship, bravery, and life on a farm.',
  },
  {
    title: 'Hidden Figures',
    author: 'Margot Lee Shetterly',
    category: 'Biography',
    level: 'Grades 7-8',
    status: 'reserved',
    summary:
      'The story of the Black women mathematicians who helped launch NASA.',
  },
  {
    title: 'The Giver',
    author: 'Lois Lowry',
    category: 'Fiction',
    level: 'Grades 6-7',
    status: 'available',
  },
  {
    title: 'Introduction to Biology',
    author: 'Neil Campbell',
    category: 'Science',
    level: 'Grades 9-10',
    status: 'on-loan',
  },
  {
    title: 'Mathematics for Junior High',
    author: 'K. A. Stroud',
    category: 'Math',
    level: 'Grades 7-8',
    status: 'available',
  },
  {
    title: 'Learning Python',
    author: 'Mark Lutz',
    category: 'Technology',
    level: 'Grades 10-12',
    status: 'maintenance',
  },
  {
    title: 'The Diary of Anne Frank',
    author: 'Anne Frank',
    category: 'History',
    level: 'Grades 7-8',
    status: 'available',
  },
]

export const seedMembers: CreateMemberInput[] = [
  {
    name: 'Alice Zhang',
    grade: 'Grade 8',
    email: 'alice.z@school.edu',
    phone: '555-8134',
  },
  {
    name: 'Ravi Kumar',
    grade: 'Grade 10',
    email: 'ravi.k@school.edu',
    phone: '555-9074',
  },
  {
    name: 'Maria Garcia',
    grade: 'Grade 6',
    email: 'maria.g@school.edu',
    phone: '555-2210',
  },
  {
    name: 'Samuel Lee',
    grade: 'Teacher',
    email: 'sam.lee@school.edu',
    phone: '555-4412',
  },
  {
    name: 'Emily Chen',
    grade: 'Grade 11',
    email: 'emily.c@school.edu',
    phone: '555-1745',
  },
]

export const seedLoans: CreateLoanInput[] = [
  {
    bookId: 1,
    memberId: 4,
    borrowedAt: '2025-01-05',
    dueAt: '2025-01-19',
    notes: 'Faculty research project',
  },
  {
    bookId: 5,
    memberId: 2,
    borrowedAt: '2025-01-12',
    dueAt: '2025-01-26',
  },
  {
    bookId: 3,
    memberId: 5,
    borrowedAt: '2025-01-09',
    dueAt: '2025-01-23',
  },
  {
    bookId: 2,
    memberId: 3,
    borrowedAt: '2024-12-20',
    dueAt: '2025-01-03',
    returnedAt: '2025-01-02',
  },
]

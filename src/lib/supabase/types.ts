export type UserRole = "student" | "admin";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type EnrollmentRow = {
  id: string;
  user_id: string;
  course_slug: string;
  enrolled_at: string;
  quiz_score: number | null;
  certificate_id: string | null;
  certified_at: string | null;
};

export type LessonProgressRow = {
  id: string;
  user_id: string;
  course_slug: string;
  lesson_id: string;
  completed_at: string;
};

export type Enrollment = {
  courseSlug: string;
  enrolledAt: string;
  completedLessons: string[];
  quizScore?: number;
  certificateId?: string;
  certifiedAt?: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role?: UserRole;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
        };
        Update: Partial<Omit<Profile, "id">>;
      };
      enrollments: {
        Row: EnrollmentRow;
        Insert: {
          user_id: string;
          course_slug: string;
          quiz_score?: number | null;
          certificate_id?: string | null;
          certified_at?: string | null;
        };
        Update: Partial<Omit<EnrollmentRow, "id" | "user_id">>;
      };
      lesson_progress: {
        Row: LessonProgressRow;
        Insert: {
          user_id: string;
          course_slug: string;
          lesson_id: string;
        };
        Update: Partial<Omit<LessonProgressRow, "id">>;
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: { email: string; name?: string; source?: string };
        Update: { email?: string; name?: string | null; source?: string | null };
      };
    };
    Functions: {
      enroll_in_course: {
        Args: { p_course_slug: string };
        Returns: EnrollmentRow;
      };
      complete_lesson: {
        Args: { p_course_slug: string; p_lesson_id: string };
        Returns: LessonProgressRow;
      };
      submit_course_quiz: {
        Args: { p_course_slug: string; p_score: number };
        Returns: EnrollmentRow;
      };
      verify_certificate: {
        Args: { p_certificate_id: string };
        Returns: {
          certificate_id: string;
          course_slug: string;
          student_name: string;
          certified_at: string;
          quiz_score: number;
        }[];
      };
    };
  };
};

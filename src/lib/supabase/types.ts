export type UserRole = "student" | "admin";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  status?: "active" | "inactive" | "suspended";
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
          status?: "active" | "inactive" | "suspended";
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
      payments: {
        Row: {
          id: string;
          reference: string;
          user_id: string | null;
          email: string;
          course_slug: string;
          course_title: string | null;
          certificate_id: string;
          amount_kobo: number;
          currency: string;
          status: string;
          provider: string;
          paid_at: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          reference: string;
          user_id?: string | null;
          email: string;
          course_slug: string;
          course_title?: string | null;
          certificate_id: string;
          amount_kobo: number;
          currency?: string;
          status?: string;
          provider?: string;
          paid_at?: string;
        };
        Update: Partial<{
          status: string;
          amount_kobo: number;
          paid_at: string;
        }>;
      };
      content_overrides: {
        Row: {
          id: string;
          course_slug: string;
          lesson_id: string;
          title: string | null;
          summary: string | null;
          video_url: string | null;
          body: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          course_slug: string;
          lesson_id: string;
          title?: string | null;
          summary?: string | null;
          video_url?: string | null;
          body?: string | null;
          updated_by?: string | null;
        };
        Update: Partial<{
          title: string | null;
          summary: string | null;
          video_url: string | null;
          body: string | null;
          updated_at: string;
        }>;
      };
      admin_activity: {
        Row: {
          id: string;
          actor_id: string | null;
          activity_type: string;
          message: string;
          meta: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          actor_id?: string | null;
          activity_type: string;
          message: string;
          meta?: Record<string, unknown>;
        };
        Update: never;
      };
    };
    Functions: {
      enroll_in_course: { Args: { p_course_slug: string }; Returns: EnrollmentRow };
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
        Returns: unknown;
      };
      record_payment: {
        Args: {
          p_reference: string;
          p_email: string;
          p_course_slug: string;
          p_certificate_id: string;
          p_amount_kobo: number;
          p_status?: string;
          p_provider?: string;
          p_course_title?: string;
          p_currency?: string;
          p_user_id?: string;
        };
        Returns: unknown;
      };
      admin_set_student_status: {
        Args: { p_user_id: string; p_status: string };
        Returns: Profile;
      };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
  };
};

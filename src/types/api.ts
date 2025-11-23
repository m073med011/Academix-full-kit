// LMS Backend API Type Definitions
// These types match the MongoDB schemas from lms-backend

// ============================================
// Enums
// ============================================

export type UserRole =
  | "student"
  | "freelancer"
  | "admin"
  | "organizer"
  | "instructor"
  | "user"

export type CourseLevel = "beginner" | "intermediate" | "advanced"

export type MaterialType = "VIDEO" | "DOCUMENT" | "LINK" | "QUIZ"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

export type PaymentMethod = "CARD"

export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "CANCELLED"

export type ChatType = "PRIVATE" | "GROUP"

export type MessageType = "TEXT" | "IMAGE" | "FILE"

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE"

export type MembershipStatus = "ACTIVE" | "INACTIVE" | "INVITED"

export type OTPPurpose = "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "TWO_FACTOR"

export type DiscountType = "PERCENTAGE" | "FIXED"

// ============================================
// Base Types
// ============================================

export interface BaseEntity {
  _id: string
  createdAt: string
  updatedAt: string
}

// ============================================
// User Types
// ============================================

export interface User extends BaseEntity {
  name: string
  email: string
  role: UserRole
  isOAuthUser?: boolean
  provider?: "google" | "credentials"
  purchasedCourses?: string[]
  organizationMemberships?: string[]
  lastActiveOrganization?: string
  imageProfileUrl?: string
  emailVerified?: boolean
  twoFactorEnabled?: boolean
}

export interface UserProfile
  extends Omit<User, "purchasedCourses" | "organizationMemberships"> {
  purchasedCourses?: Course[]
  organizationMemberships?: OrganizationMembership[]
}

// ============================================
// Authentication Types
// ============================================

export interface LoginRequest {
  email: string
  password: string
}

// Backend login can return different states
export interface LoginSuccessResponse {
  success: true
  user: User
  organizations?: Organization[]
  activeOrganizationId?: string
  accessToken: string
  refreshToken: string
}

export interface LoginRequiresVerificationResponse {
  success: true
  requiresEmailVerification: true
  user: Pick<
    User,
    "_id" | "name" | "email" | "emailVerified" | "twoFactorEnabled"
  >
  message: string
}

export interface LoginRequires2FAResponse {
  success: true
  requires2FA: true
  user: Pick<
    User,
    "_id" | "name" | "email" | "emailVerified" | "twoFactorEnabled"
  >
  message: string
}

export type LoginResponse =
  | LoginSuccessResponse
  | LoginRequiresVerificationResponse
  | LoginRequires2FAResponse

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: UserRole
  imageProfileUrl?: string
  isOAuthUser?: boolean
  provider?: "google" | "credentials"
}

// Register always requires email verification for credentials users
export interface RegisterSuccessResponse {
  success: true
  requiresEmailVerification: true
  user: Pick<
    User,
    | "_id"
    | "name"
    | "email"
    | "role"
    | "imageProfileUrl"
    | "emailVerified"
    | "twoFactorEnabled"
  >
  message: string
}

// OAuth registration returns tokens immediately
export interface RegisterOAuthResponse {
  success: true
  token: string
  user: User
}

export type RegisterResponse = RegisterSuccessResponse | RegisterOAuthResponse

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  success: boolean
  data: {
    accessToken: string
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface VerifyEmailResponse {
  success: true
  user: User
  organizations?: Organization[]
  activeOrganizationId?: string
  accessToken: string
  refreshToken: string
  message: string
}

export interface Verify2FARequest {
  email: string
  code: string
}

export interface Enable2FARequest {
  password: string
}

export interface Confirm2FARequest {
  otp: string
}

// ============================================
// OTP Types
// ============================================

export interface GenerateOTPRequest {
  email: string
  purpose: OTPPurpose
}

export interface VerifyOTPRequest {
  email: string
  code: string
  purpose: OTPPurpose
}

export interface ResendOTPRequest {
  email: string
  purpose: OTPPurpose
}

// ============================================
// Course Types
// ============================================

export interface Course extends BaseEntity {
  title: string
  description: string
  instructor: string | User
  editors?: string[] | User[]
  price: number
  duration: number
  level: CourseLevel
  category: string
  thumbnail?: string
  isPublished: boolean
  students?: string[] | User[]
  rating?: number
  materials?: string[] | Material[]
  organizationId?: string
  isOrgPrivate?: boolean
  termId?: string
}

export interface CreateCourseRequest {
  title: string
  description: string
  price: number
  duration: number
  level: CourseLevel
  category: string
  thumbnail?: string
  isPublished?: boolean
  organizationId?: string
  isOrgPrivate?: boolean
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

// ============================================
// Material Types
// ============================================

export interface Material extends BaseEntity {
  title: string
  description?: string
  courseId: string
  type: MaterialType
  fileUrl?: string
  duration?: number
  order: number
}

export interface CreateMaterialRequest {
  title: string
  description?: string
  courseId: string
  type: MaterialType
  fileUrl?: string
  duration?: number
  order?: number
}

// ============================================
// Organization Types
// ============================================

export interface OrganizationSettings {
  allowMultipleLevels?: boolean
  requireTermAssignment?: boolean
  allowStudentSelfEnroll?: boolean
}

export interface Organization extends BaseEntity {
  name: string
  description?: string
  owner: string | User
  settings?: OrganizationSettings
}

export interface OrganizationRole extends BaseEntity {
  organizationId: string
  name: string
  permissions: string[]
  description?: string
}

export interface OrganizationMembership extends BaseEntity {
  organizationId: string | Organization
  userId: string | User
  roleId: string | OrganizationRole
  joinedDate: string
  status: MembershipStatus
}

export interface CreateOrganizationRequest {
  name: string
  description?: string
  settings?: OrganizationSettings
}

// ============================================
// Payment Types
// ============================================

export interface Payment extends BaseEntity {
  userId: string | User
  courseIds: string[] | Course[]
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod: PaymentMethod
  paymobOrderId?: string
  paymobTransactionId?: string
  invoiceId?: string
}

export interface CreatePaymentRequest {
  courseId: string
}

export interface CreateBulkPaymentRequest {
  courseIds: string[]
  discountCode?: string
}

// ============================================
// Invoice Types
// ============================================

export interface Invoice extends BaseEntity {
  paymentId: string | Payment
  userId: string | User
  courses: string[] | Course[]
  totalAmount: number
  discountAmount: number
  finalAmount: number
  invoiceNumber: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
}

// ============================================
// Cart Types
// ============================================

export interface CartItem {
  courseId: string | Course
  addedDate: string
}

export interface Cart extends BaseEntity {
  userId: string
  items: CartItem[]
}

export interface AddToCartRequest {
  courseId: string
}

// ============================================
// Discount Types
// ============================================

export interface DiscountCode extends BaseEntity {
  code: string
  creatorId: string | User
  courseId?: string | Course
  discountType: DiscountType
  discountValue: number
  maxUses: number
  currentUses: number
  isActive: boolean
  expiryDate: string
}

export interface CreateDiscountRequest {
  code: string
  courseId?: string
  discountType: DiscountType
  discountValue: number
  maxUses: number
  expiryDate: string
}

export interface ValidateDiscountRequest {
  code: string
  courseIds: string[]
}

// ============================================
// Chat Types
// ============================================

export interface Chat extends BaseEntity {
  type: ChatType
  participants: string[] | User[]
  courseId?: string
  lastMessage?: string | Message
  lastMessageTime?: string
}

export interface Message extends BaseEntity {
  chatId: string
  senderId: string | User
  content: string
  type: MessageType
  fileUrl?: string
  isRead: boolean
  readBy?: string[]
}

export interface CreatePrivateChatRequest {
  participantId: string
}

export interface SendMessageRequest {
  content: string
  type?: MessageType
  fileUrl?: string
}

// ============================================
// Attendance Types
// ============================================

export interface Attendance extends BaseEntity {
  studentId: string | User
  materialId: string | Material
  courseId: string | Course
  status: AttendanceStatus
  date: string
  recordedBy: string | User
}

export interface RecordAttendanceRequest {
  studentId: string
  materialId: string
  courseId: string
  status: AttendanceStatus
}

// ============================================
// Level & Term Types
// ============================================

export interface Level extends BaseEntity {
  organizationId: string
  name: string
  description?: string
  order: number
}

export interface Term extends BaseEntity {
  levelId: string
  organizationId: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  success: false
  error: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  total: number
  page: number
  totalPages: number
}

// ============================================
// Analysis Types
// ============================================

export interface InstructorAnalysis {
  totalCourses: number
  totalStudents: number
  totalRevenue: number
  averageRating: number
}

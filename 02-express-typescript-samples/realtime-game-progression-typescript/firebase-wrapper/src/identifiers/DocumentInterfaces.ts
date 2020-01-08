import { Types } from './Types';

export namespace DocumentInterfaces {
  export interface ICourseDoc {
    id: string;
    districtId?: string;
    schoolId: string;
    name: string;
    sisId?: string;
    subject?: string;
    students?: string[];
    teacherId: string;
    teachers?: string[];
    grade?: string;
    description?: string;
    enrollmentCode: string;
    creationMode?: Types.CreationModes;
    noOfStudents?: number;
    courseState?: Types.CourseStates;
    googleClassRoomInfo?: string;
    creationTime?: string;
    updateTime?: string;
  }
  export interface ICourseEnrollmentDoc {
    id: string;
    courseId: string;
    userId: string;
    role: Types.UserPermissionRoles;
  }
  export interface ICourseWorkDoc {
    id: string;
    title: string;
    scheduledDate: string;
    assigneeMode: Types.AssigneeModes;
    contentId: string;
    courseId: string;
    assignorId: string;
    schoolId: string;
    dueDate: string;
    assignedStudentIds: string[];
    description: string;
    maxPoints: number;
    courseWorkState: Types.CourseWorkStates;
    shareCourseWorkOnGoogleClassRoom: boolean;
    googleClassRoomInfo: string;
  }
  export interface IStudentSubmissionDoc {
    id: string;
    courseId: string;
    courseWorkId: string;
    schoolId: string;
    userId: string;
    creationTime: string;
    updateTime: string;
    submissionState: Types.SubmissionStates;
    submissionHistory: any;
    contentId: string;
    googleClassRoomInfo: string;
  }
  export interface IProviderIds {
    email?: string;
    google?: string;
    clever?: string;
    phone?: string;
    facebook?: string;
  }
  export interface IUsersDoc {
    id: string;
    name: string;
    email: string;
    providerIds: IProviderIds;
    role: Types.UserPermissionRoles;
    password?: string;
    googleAuthRefreshToken?: string;
    districtId: string;
    schoolId: string;
    courseId?: string;
    schools?: string[];
    sisId?: string;
    parentId?: string;
    primaryNumber?: string;
    secondaryNumber?: string[];
    secondaryPassword?: string;
    lastAssignedCourseWork?: {
      id: string;
      title: string;
      contentId: string;
    };
    imageUrl?: string;
    children?: string[] | IUsersDoc[];
    grade?: string;
    age?: number;
  }

  export interface IDomainsDoc {
    id: string;
    name: string;
    meta: string;
  }
  export interface ITrialLogDoc {
    id: string;
    courseId: string;
    courseWorkId: string;
    schoolId: string;
    studentId: string;
    questionId: string;
    tags: string[];
    timestamp: string;
    response: any;
  }
  export interface IStudentStateDoc {
    id: string;
    studentId: string;
    courseId?: string;
    state: any;
  }

  export interface ISessionReportDoc {
    studentId: string;
    weeklyQuizReports: {};
    dailyPracticeReports: {};
    childPracticeReports: {};
  }

  export interface IParentStateDoc {
    id: string;
    userId: string;
    isMute: boolean;
    reminders: ISetNotificationRequest[];
  }

  export interface IContentStateDoc {
    id: string;
    studentId: string;
    contentId: string;
    state: any;
  }
  export interface IAuth {
    uname?: string;
    email: string;
    password: string;
    role: Types.UserPermissionRoles;
    remember?: boolean;
    userId?: string;
  }

  export interface IAddParent {
    email?: string;
    phoneNumber?: string;
    childId: string
  }

  export interface ICredentials {
    name: string;
    uid: string;
    role: Types.UserPermissionRoles;
    email: string;
    providerId: string;
    schoolId: string;
  }
  export interface ICredentialsSet {
    credentials?: ICredentials;
    remember?: boolean;
  }

  export interface ISchool {
    id: string;
    name: string;
    districtId?: string;
    sisNumber?: string;
    schoolNumber?: string;
    lowGrade?: string;
    highGrade?: string;
    ncesId?: string;
    mdrNumber?: string;
  }

  export interface INotificationChannelMetadata {
    [Types.NotificationChannels.WHATSAPP]?: {
      contactNumber: string | null;
      message: string | null;
      isEnabled: boolean;
      status?: number | 0;
      notificationId?: string;
    },
    [Types.NotificationChannels.MAIL]?: {
      to: string | null;
      subject: string | null;
      body: string | null;
      isEnabled: boolean;
      status?: number | 0;
      notificationId?: string;
    },
    [Types.NotificationChannels.SMS]?: {
      contactNumber: string | null;
      message: string | null;
      isEnabled: boolean;
      status?: number | 0;
      notificationId?: string;
    },
    [Types.NotificationChannels.PUSH_NOTIFICATION]?: {
      title: string | null;
      to: string | null;
      body: string | null;
      click_action: string | null;
      icon: string | null;
      isEnabled: boolean;
      status?: number | 0;
      notificationId?: string;
    }
  }
  export interface ISetNotificationRequest {
    id: string;
    userPreference: {
      firstName: string;
      lastName?: string;
      startTime: string;
      endTime: string;
      time: string;
      timeZone: number;
      days?: number[];
    };
    groupId: string;
    notificationChannelMetadata: INotificationChannelMetadata
  }
  export interface ISendNotificationResponse {
    status: boolean;
    data?: any;
    message?: string;
  }
}
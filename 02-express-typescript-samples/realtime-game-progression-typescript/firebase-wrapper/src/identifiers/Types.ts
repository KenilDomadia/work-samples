export namespace Types {
  export enum CourseStates {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED'
  }

  export enum CourseWorkStates {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PROVISIONED = 'PROVISIONED', // The course has been created, but not yet activated.
    COURSE_STATE_UNSPECIFIED = 'COURSE_STATE_UNSPECIFIED'
  }

  export enum SubmissionStates {
    INACTIVE = 'INACTIVE',
    NEW = 'NEW', // student has never accessed this submission
    CREATED = 'CREATED' // has been created
  }

  export enum AssigneeModes {
    ALL_STUDENTS = 'ALL_STUDENTS',
    INDIVIDUAL_STUDENTS = 'INDIVIDUAL_STUDENTS'
  }

  export enum UserAuthProviders {
    GOOGLE = 'google',
    EMAIL = 'email',
    CLEVER = 'clever',
    FACEBOOK = 'facebook',
    PHONE = 'phone'
  }

  export enum CreationModes {
    CLEVER = 'CLEVER',
    GOOGLE_CLASSROOM = 'GOOGLE_CLASSROOM', // Accessing Via Google Classroom
    MANUAL = 'MANUAL' // Manually Via the Application
  }

  export enum ContentTypes {
    PROGRAM = 'programTypes',
    ACTIVITY = 'activityTypes',
    ITEM = 'itemTypes',
    QUESTION = 'questionTypes',
    VIRTUALGOODS = 'virtualGoodTypes'
  }

  export enum ContentIndices {
    PROGRAM = 'programs',
    ACTIVITY = 'activities',
    ITEM = 'items',
    QUESTION = 'questions'
  }

  export enum UserPermissionRoles {
    DISTRICT_ADMIN = 'DISTRICT_ADMIN',
    SCHOOL_ADMIN = 'SCHOOL_ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
    PARENT = 'PARENT'
  }

  export enum AuthProviderId {
    EMAIL = 'password',
    GOOGLE = 'google.com',
    PHONE = 'phone'
  }

  export enum NotificationChannels {
    SMS = 'SMS',
    WHATSAPP = 'WHATSAPP',
    MAIL = 'MAIL',
    PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
  }

  export enum MessageTemplates {
    TEMPLATE_1 = 'Welcome to FactFlow! $0’s first two minute session is ready. Click here: $1',
    TEMPLATE_2 = 'Welcome to $0! $1’s first two minute session is ready. Click here: $2',
    TEMPLATE_3 = 'Hey there! Just letting you know that you have enabled communication with $0 via WhatsApp. Request you to kindly save this number. You can reply with ‘STOP’ anytime you wish to stop communication through this channel.',
    TEMPLATE_4 = 'Welcome to $0! $1’s first $2 minute session is ready. Click here: $3',
    TEMPLATE_5 = 'It’s time for a weekly assessment of math fact fluency! $0',
    TEMPLATE_6 = 'This is a reminder for $0’s weekly assessment. Please take these once a week to see growth. 2 min. $1',
    TEMPLATE_7 = 'You have practiced $0 days in a row! That’s fantastic.Keep it up $1',
    TEMPLATE_8 = 'Hey there! Just letting you know that you have set up reminders with $0 via WhatsApp. You can reply with ‘STOP’ anytime you wish to stop communication through this channel.',
    TEMPLATE_9 = 'Hope you’re enjoying your daily sessions with $0.Here’s the link for today’s session - $1  ',
    TEMPLATE_10 = 'Hey there! Just letting you know that you have set up reminders with $0',
    TEMPLATE_11 = 'Hey there! Just letting you know that you have set up reminders with $0 via WhatsApp.Request you to kindly save this number.You can reply with ‘STOP’ anytime you wish to stop communication through this channel.',
    TEMPLATE_12 = '$0 is trying to send feedback for your app.',
    TEMPLATE_13 = '$0 has signed up to your app.',
    TEMPLATE_14 = '$0 has set up reminders in your app.',
    ALERT_STOPPED_IF_ACTIVE_REMINDER = 'Thank you for staying in touch. We will ensure that you will not receive any further reminders from us. If you change your mind, and want to continue receiving alerts, you can simply enable updates by replying ‘START’.',
    ALERT_STOPPED_IF_NOREMINDER = 'Thank you for staying in touch. We will ensure that you will not receive any further alerts from us. If you change your mind, and want to continue receiving alerts, you can simply enable updates by clicking the link below $0',
    DEFAULT_RESPONSE = 'You can stop reminders by typing STOP.',
    OTP = '$0 is your Fact Flow verification OTP. Do not share this OTP with anyone.',
    DAILY_REMINDER = 'Hi $0, this is a reminder for $1’s 2 minute session. Please take these regularly to see growth. Tap here - $2'
  }

  export const BACKEND_URL =
    'https://us-central1-ppl-factflow.cloudfunctions.net';


  export enum AssignmentTypes {
    ADD_SUB = 'ADD_SUB',
    MUL_DIV = 'MUL_DIV',
    ALL_OPERATIONS = 'ALL_OPERATIONS'
  }

  export enum AddParentErrors {
    CONTACT_NUMBER_LINKED = 'Contact Number is already linked with another account',
    EMAIL_LINKED = 'Email is already linked with another account',
    CONTACT_AND_EMAIL_LINKED = 'Contact Number and Email are already linked with another account',
    EMAIL_LINK_ERROR = 'Contact Number is already linked with another email',
    CONTACT_NUMBER_LINK_ERROR = 'Email is already linked with another contact number',
  }
}

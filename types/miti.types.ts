export type Months =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"

export type CalendarData = Record<Months, DayData[]>

export interface DayData {
  year: string
  quarter: number
  month: string
  week: number
  week_day: number
  is_today: boolean
  day: string
  ad: string
  AD_date: ADDate
  events: Event[]
}

export interface ADDate {
  ad: string
  bs: string
  bs_day: number
  bs_month: number
  bs_year: number
  tithi: number
  ns_month: string
  ns_year: number
  chandrama: number
  is_verified: number
  remarks: string
}

export interface Event {
  ad: string
  bs: string
  bs_day: number
  bs_month: number
  bs_year: number
  tithi: number
  ns_month: string
  ns_year: number
  chandrama: number
  is_verified: number
  remarks: string
  updated_at: string
  event_index_id: number | null
  event_date: string | null
  ex_date: string | null
  id: null | string
  jpid: null
  jtl: null | string
  jds: JDS | null
  jsdt: string | null
  jed: string | null
  recurring_end_date: string | null
  jir: number | null
  has_reminder: number | null
  status: number | null
  duration: number | null
  rrule: null | string
  jci: null | string
  jbo: string | null
  jlo: null | string
  jtp: string | null
  priority: null | string
  verification_id: number | null
  event_verified_date: string | null
  verification_status: number | null
  verification_remarks: string | null
  exception_date: string | null
  new_date: string | null
  exception_status: number | null
  exception_remarks: null
  holiday_date: string | null
  holiday_type: null
  holiday_status: number | null
  gh: number
  jfr: Jfr
  jeddt: any[] | JeddtClass
  jevdt?: Jevdt
}

export interface JDS {
  jnid: string
  jct: string
  ne: string
  en: string
  jiu?: string
  jis?: string
  jbi: string
  jie: string
  jbd: string
  gh: string
}

export interface Jfr {
  jfrri: number | string
  jfrm?: string
  jfrmd?: string
  jfrrt?: string
  jfrrbdy?: string
  recurring_by_until?: string
  jfrrbu?: string
}

export interface JeddtClass {
  event_id: string
  ex_date: string
  new_date: string
  status: number
  remarks: null
}

export interface Jevdt {
  event_id: string
  event_date: string
  status: number
  remarks: string
}

export type NewCalendarData = {
  calendarInfo: {
    dates: {
      bs: {
        year: {
          np: string | null
          en: string | null
        }
        month: {
          np: string | null
          code: {
            np: string | null
            en: string | null
          }
          en: string | null
        }
        day: {
          np: string | null
          en: string | null
        }
        full: {
          np: string | null
          en: string | null
        }
      }
      ad: {
        year: {
          np: string | null
          en: string | null
        }
        month: {
          np: string | null
          code: {
            np: string | null
            en: string | null
          }
          en: string | null
        }
        day: {
          np: string | null
          en: string | null
        }
        full: {
          np: string | null
          en: string | null
        }
      }
    }
    days: {
      dayOfWeek: {
        np: string | null
        en: string | null
      }
      codes: {
        np: string | null
        en: string | null
      }
    }
    nepaliEra: {
      sakSambat: {
        np: string | null
        en: string | null
      }
      nepalSambat: {
        year: {
          np: string | null
          en: string | null
        }
        month: {
          np: string | null
          code: {
            np: string | null
            en: string | null
          }
          en: string | null
        }
      }
    }
  }
  tithiDetails: TithiDetails
  panchangaDetails: PanchangaDetails
  hrituDetails: {
    id: string | null
    title: {
      np: string | null
      en: string | null
    }
    codes: {
      np: string | null
      en: string | null
    }
  } | null
  auspiciousMoments: {
    sahits: Array<{
      id: string | null
      title: {
        np: string | null
        en: string | null
      }
      description: {
        np: string | null
        en: string | null
      }
      times: {
        start: {
          np: string | null
          en: string | null
        }
        end: {
          np: string | null
          en: string | null
        }
      }
    }>
    muhurats: Array<{
      periodName: string | null
      duration: string | null
    }>
  }
  eventDetails: EventDetail[]
}

export type PanchangaDetails = {
  pakshya: {
    np: string | null
    en: string | null
  }
  chandraRashi: {
    time: {
      np: string | null
      en: string | null
    }
    endTime: {
      np: string | null
      en: string | null
    }
  }
  suryaRashi: {
    np: string | null
    en: string | null
  }
  nakshatra: {
    np: string | null
    endTime: {
      np: string | null
      en: string | null
    }
    ghaPa: {
      np: string | null
      en: string | null
    }
  }
  yog: {
    np: string | null
    en: string | null
    endTime: {
      np: string | null
      en: string | null
    }
  }
  karans: {
    first: {
      np: string | null
      endTime: {
        np: string | null
        en: string | null
      }
    }
    second: {
      np: string | null
      endTime: {
        np: string | null
        en: string | null
      }
    }
  }
  season: {
    name: {
      np: string | null
      en: string | null
    }
    code: {
      np: string | null
      en: string | null
    }
  }
  times: {
    sunrise: string | null
    sunset: string | null
    moonrise: string | null
    moonset: string | null
  }
} | null

export type TithiDetails = {
  title: {
    np: string | null
    en: string | null
  }
  code: {
    np: string | null
    en: string | null
  }
  endTime: {
    np: string | null
    en: string | null
  }
  display: {
    np: string | null
    en: string | null
  }
} | null

export type EventDetail = {
  id: string | null
  category: {
    name: string | null
    id: string | null
  }
  displayType: string | null
  title: {
    np: string | null
    en: string | null
  }
  isHoliday: boolean
  location: string | null
  timing: {
    from: string | null
    to: string | null
  }
  details: {
    en: string | null
    np: string | null
  }
}

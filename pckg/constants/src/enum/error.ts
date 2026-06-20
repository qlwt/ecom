export enum ServerError {
    Internal = "error_internal",
    NotFound = "error_notfound",
    BadAuth = "error_badauth",
    NoAuth = "error_noauth",
    BadReq = "error_badreq",
    TooOften = "error_toooften",
    AlreadyPending = "error_alreadypending",
    Blocked = "error_blocked"
}

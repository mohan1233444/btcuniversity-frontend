# BTCUni Frontend

## Overview
BTCUni is a smart contract for an on-chain course platform.  
- **Students** can enroll in courses.  
- **Instructors** can mark course completions.  
- **Admin** controls course creation and manages who is allowed to join.  

---

## Key Terms
- **Owner/Admin**: The person who controls the platform.  
- **Course Price**: Default is `10 STX` per course.  

---

## Errors You Might See
| Code  | Meaning |
|-------|---------|
| `100` | Only the owner can do this |
| `101` | Course not found |
| `102` | You are not allowed to join |
| `103` | You are not enrolled in this course |
| `104` | Already enrolled or already allowed |
| `107` | Not enough STX to pay |
| `108` | Unauthorized action |

---

## How Data is Stored
- **course-id** → keeps track of the latest course number  
- **whitelisted-beta** → tracks which students are allowed to join  
- **courses** → stores info about each course (name, details, price, instructor, max students)  
- **student-courses** → tracks which courses a student is enrolled in and their progress  

---

## Functions You Can Use

### Whitelist Management
- **enroll-whitelist()** → Student requests to join the whitelist  
- **add-whitelist(student)** → Admin adds a student  
- **remove-whitelist(student)** → Admin removes a student  
- **is-whitelisted-beta(student)** → Check if a student is allowed  

### Course Management
- **add-course(name, details, price, max-students)** → Admin adds a new course  
- **get-course-details(id)** → See info about a course  
- **get-course-count()** → See how many courses exist  

### Enrollment
- **enroll-course(course-id)** → Student enrolls and pays for a course  
- **complete-course(course-id, student)** → Instructor or admin marks course as completed  

---

## Notes
- Only students on the whitelist can enroll.  
- Payments are in STX and go to the admin.  
- Only the instructor or admin can mark course completions.  

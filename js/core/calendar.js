// calendar.js

let currentDate = new Date(1960, 9, 1); // Oct 1, 1960 (month = 0-based)

export function getCurrentDate() {
    return currentDate;
}

export function advanceDay() {
    currentDate.setDate(currentDate.getDate() + 1);
}

export function advanceDays(num) {
    for (let i = 0; i < num; i++) {
        advanceDay();
    }
}

export function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

export function setDate(date) {
    currentDate = date;
}

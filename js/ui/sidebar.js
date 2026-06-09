window.showScreen = function (screenName, btn) {

    console.log("Switching to:", screenName);

    // hide all screens
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });

    document.getElementById(screenName + "Screen")?.classList.remove("hidden");

    // update active button
    document.querySelectorAll(".nav-btn").forEach(b => {
        b.classList.remove("active");
    });

    if (btn) btn.classList.add("active");

    // ROSTER SCREEN
    if (screenName === "roster" && window.userTeam) {
        window.renderRoster(window.userTeam.roster);
    }

    // LEAGUE SCREEN
    if (screenName === "league" && window.userTeam && window.renderStandings) {

        window.renderStandings(
            window.getStandings(),
            window.userTeam.name
        );

    }

    //CALENDAR SCREEN
    if (screenName === "calendar" && window.userTeam) {

        // start viewing from current date
        window.calendarViewDate = new Date(getCurrentDate());

        window.renderCalendarView();
    }



};
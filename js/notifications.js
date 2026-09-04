/* =========================================
   JABICO CONSULTANCY
   NOTIFICATIONS JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================
       ELEMENTS
    ====================================== */

    const notificationList =
        document.getElementById("notificationList");

    const emptyState =
        document.getElementById("emptyState");

    const searchInput =
        document.getElementById("searchInput");

    const markAllButton =
        document.getElementById("markAllButton");

    const refreshButton =
        document.getElementById("refreshButton");

    const clearFilters =
        document.getElementById("clearFilters");


    /* COUNTERS */

    const totalCount =
        document.getElementById("totalCount");

    const unreadCount =
        document.getElementById("unreadCount");

    const readCount =
        document.getElementById("readCount");

    const importantCount =
        document.getElementById("importantCount");

    const unreadTabCount =
        document.getElementById("unreadTabCount");

    const sidebarNotificationCount =
        document.getElementById(
            "sidebarNotificationCount"
        );

    const notificationDot =
        document.getElementById(
            "notificationDot"
        );


    /* MODAL */

    const notificationModal =
        document.getElementById(
            "notificationModal"
        );

    const modalOverlay =
        document.getElementById(
            "modalOverlay"
        );

    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const modalIcon =
        document.getElementById(
            "modalIcon"
        );

    const modalCategory =
        document.getElementById(
            "modalCategory"
        );

    const modalTitle =
        document.getElementById(
            "modalTitle"
        );

    const modalTime =
        document.getElementById(
            "modalTime"
        );

    const modalMessage =
        document.getElementById(
            "modalMessage"
        );

    const modalReadButton =
        document.getElementById(
            "modalReadButton"
        );

    const modalDeleteButton =
        document.getElementById(
            "modalDeleteButton"
        );


    /* SIDEBAR */

    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const sidebarOverlay =
        document.getElementById(
            "sidebarOverlay"
        );


    /* =====================================
       STUDENT NAME
    ====================================== */

    const firstName =
        localStorage.getItem(
            "jabicoFirstName"
        );

    const lastName =
        localStorage.getItem(
            "jabicoLastName"
        );

    const studentName =
        document.getElementById(
            "studentName"
        );


    if (firstName || lastName) {

        studentName.textContent =
            `${firstName || ""} ${lastName || ""}`.trim();

    }


    /* =====================================
       YEAR
    ====================================== */

    document.getElementById(
        "currentYear"
    ).textContent =
        new Date().getFullYear();


    /* =====================================
       DEMO NOTIFICATION DATA
       
       TEMPORARY FRONTEND DATA.

       Later this will come from:
       
       GET /api/student/notifications
    ====================================== */

    let notifications = [

        {
            id: 1,

            title:
                "New Learning Material Uploaded",

            category:
                "Learning Material",

            message:
                "A new learning document has been uploaded to your course materials. Log in to the Learning Materials section to view and download it.",

            date:
                "2026-09-01T09:30:00",

            read:
                false,

            important:
                true,

            icon:
                "fa-file-arrow-up"

        },


        {
            id: 2,

            title:
                "Upcoming Class Reminder",

            category:
                "Schedule",

            message:
                "You have an upcoming Introduction to Material Science class scheduled for today at 10:00 AM.",

            date:
                "2026-09-01T08:00:00",

            read:
                false,

            important:
                true,

            icon:
                "fa-calendar-days"

        },


        {
            id: 3,

            title:
                "Welcome to Jabico Consultancy",

            category:
                "General",

            message:
                "Welcome to the Jabico Consultancy Private Cohort Learning Portal. We are excited to have you as part of the cohort.",

            date:
                "2026-08-31T10:15:00",

            read:
                true,

            important:
                false,

            icon:
                "fa-hand-wave"

        },


        {
            id: 4,

            title:
                "Course Update",

            category:
                "Course",

            message:
                "Your course information has been updated. Please visit the My Courses section to review your current learning progress.",

            date:
                "2026-08-30T14:20:00",

            read:
                false,

            important:
                false,

            icon:
                "fa-book-open"

        },


        {
            id: 5,

            title:
                "Assignment Reminder",

            category:
                "Assignment",

            message:
                "Remember to review your current course assignments and submit any outstanding work before the deadline.",

            date:
                "2026-08-29T16:45:00",

            read:
                true,

            important:
                false,

            icon:
                "fa-clipboard-check"

        },


        {
            id: 6,

            title:
                "Schedule Updated",

            category:
                "Schedule",

            message:
                "Your weekly class schedule has been updated. Please check the Schedule section for the latest timetable.",

            date:
                "2026-08-28T12:10:00",

            read:
                true,

            important:
                true,

            icon:
                "fa-calendar-check"

        }

    ];


    /* =====================================
       STATE
    ====================================== */

    let currentFilter =
        "all";

    let selectedNotificationId =
        null;


    /* =====================================
       ESCAPE HTML
    ====================================== */

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            String(value ?? "");

        return element.innerHTML;

    }


    /* =====================================
       FORMAT TIME
    ====================================== */

    function formatRelativeTime(dateString) {

        const date =
            new Date(dateString);

        const now =
            new Date();

        const difference =
            Math.floor(
                (now - date) / 1000
            );


        if (difference < 60) {

            return "Just now";

        }


        const minutes =
            Math.floor(
                difference / 60
            );


        if (minutes < 60) {

            return `${minutes}m ago`;

        }


        const hours =
            Math.floor(
                minutes / 60
            );


        if (hours < 24) {

            return `${hours}h ago`;

        }


        const days =
            Math.floor(
                hours / 24
            );


        if (days < 7) {

            return `${days}d ago`;

        }


        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =====================================
       GET FILTERED NOTIFICATIONS
    ====================================== */

    function getFilteredNotifications() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        return notifications.filter(
            notification => {

                const matchesSearch =

                    notification.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    notification.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    notification.message
                        .toLowerCase()
                        .includes(search);


                let matchesFilter = true;


                if (
                    currentFilter ===
                    "unread"
                ) {

                    matchesFilter =
                        !notification.read;

                }


                if (
                    currentFilter ===
                    "read"
                ) {

                    matchesFilter =
                        notification.read;

                }


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );

    }


    /* =====================================
       UPDATE COUNTERS
    ====================================== */

    function updateCounters() {

        const total =
            notifications.length;


        const unread =
            notifications.filter(
                item =>
                    !item.read
            ).length;


        const read =
            notifications.filter(
                item =>
                    item.read
            ).length;


        const important =
            notifications.filter(
                item =>
                    item.important
            ).length;


        totalCount.textContent =
            total;


        unreadCount.textContent =
            unread;


        readCount.textContent =
            read;


        importantCount.textContent =
            important;


        unreadTabCount.textContent =
            unread;


        sidebarNotificationCount.textContent =
            unread;


        if (unread > 0) {

            notificationDot.classList.remove(
                "hidden"
            );

        }

        else {

            notificationDot.classList.add(
                "hidden"
            );

        }

    }


    /* =====================================
       CREATE NOTIFICATION
    ====================================== */

    function createNotificationElement(
        notification
    ) {

        const item =
            document.createElement(
                "article"
            );


        item.className =
            "notification-item";


        if (!notification.read) {

            item.classList.add(
                "unread"
            );

        }


        item.innerHTML = `

            <span class="unread-dot"></span>


            <div class="notification-icon">

                <i class="fa-solid ${escapeHTML(notification.icon)}"></i>

            </div>


            <div class="notification-content">


                <div class="notification-content-top">

                    <h3>

                        ${escapeHTML(notification.title)}

                    </h3>


                    <span class="notification-time">

                        ${formatRelativeTime(notification.date)}

                    </span>

                </div>


                <span class="notification-category">

                    ${escapeHTML(notification.category)}

                </span>


                <p class="notification-message">

                    ${escapeHTML(notification.message)}

                </p>


            </div>


            <div class="notification-actions">


                <button
                    type="button"
                    class="notification-action view"
                    title="View notification"
                >

                    <i class="fa-solid fa-eye"></i>

                </button>


                <button
                    type="button"
                    class="notification-action read"
                    title="${notification.read ? "Mark as unread" : "Mark as read"}"
                >

                    <i class="fa-solid ${notification.read ? "fa-envelope" : "fa-check"}"></i>

                </button>


                <button
                    type="button"
                    class="notification-action delete"
                    title="Delete notification"
                >

                    <i class="fa-regular fa-trash-can"></i>

                </button>


            </div>

        `;


        /* VIEW */

        item.querySelector(
            ".view"
        ).addEventListener(
            "click",
            () => {

                openModal(
                    notification
                );

            }
        );


        /* READ */

        item.querySelector(
            ".read"
        ).addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleRead(
                    notification.id
                );

            }
        );


        /* DELETE */

        item.querySelector(
            ".delete"
        ).addEventListener(
            "click",
            event => {

                event.stopPropagation();

                deleteNotification(
                    notification.id
                );

            }
        );


        /* CLICK CARD */

        item.addEventListener(
            "click",
            event => {

                if (
                    !event.target.closest(
                        "button"
                    )
                ) {

                    openModal(
                        notification
                    );

                }

            }
        );


        return item;

    }


    /* =====================================
       RENDER
    ====================================== */

    function renderNotifications() {

        const filtered =
            getFilteredNotifications();


        notificationList.innerHTML =
            "";


        if (!filtered.length) {

            emptyState.hidden =
                false;

            notificationList.style.display =
                "none";

            return;

        }


        emptyState.hidden =
            true;

        notificationList.style.display =
            "flex";


        filtered.forEach(
            notification => {

                notificationList.appendChild(
                    createNotificationElement(
                        notification
                    )
                );

            }
        );

    }


    /* =====================================
       TOGGLE READ
    ====================================== */

    function toggleRead(id) {

        const notification =
            notifications.find(
                item =>
                    item.id === id
            );


        if (!notification) {

            return;

        }


        notification.read =
            !notification.read;


        updateCounters();

        renderNotifications();

    }


    /* =====================================
       MARK ALL READ
    ====================================== */

    function markAllAsRead() {

        notifications.forEach(
            notification => {

                notification.read =
                    true;

            }
        );


        updateCounters();

        renderNotifications();

    }


    /* =====================================
       DELETE
    ====================================== */

    function deleteNotification(id) {

        notifications =
            notifications.filter(
                notification =>
                    notification.id !== id
            );


        if (
            selectedNotificationId === id
        ) {

            closeModal();

        }


        updateCounters();

        renderNotifications();

    }


    /* =====================================
       OPEN MODAL
    ====================================== */

    function openModal(notification) {

        selectedNotificationId =
            notification.id;


        modalIcon.innerHTML = `

            <i class="fa-solid ${escapeHTML(notification.icon)}"></i>

        `;


        modalCategory.textContent =
            notification.category;


        modalTitle.textContent =
            notification.title;


        modalTime.textContent =
            formatRelativeTime(
                notification.date
            );


        modalMessage.textContent =
            notification.message;


        modalReadButton.innerHTML = `

            <i class="fa-solid ${notification.read ? "fa-envelope" : "fa-check"}"></i>

            ${notification.read ? "Mark as Unread" : "Mark as Read"}

        `;


        notificationModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";


        /*
         * Opening an unread notification
         * automatically marks it as read.
         */

        if (!notification.read) {

            notification.read =
                true;

            updateCounters();

            renderNotifications();

        }

    }


    /* =====================================
       CLOSE MODAL
    ====================================== */

    function closeModal() {

        notificationModal.hidden =
            true;

        selectedNotificationId =
            null;

        document.body.style.overflow =
            "";

    }


    /* =====================================
       MODAL READ BUTTON
    ====================================== */

    modalReadButton.addEventListener(
        "click",
        () => {

            if (
                selectedNotificationId === null
            ) {

                return;

            }


            toggleRead(
                selectedNotificationId
            );


            const notification =
                notifications.find(
                    item =>
                        item.id ===
                        selectedNotificationId
                );


            if (notification) {

                modalReadButton.innerHTML = `

                    <i class="fa-solid ${notification.read ? "fa-envelope" : "fa-check"}"></i>

                    ${notification.read ? "Mark as Unread" : "Mark as Read"}

                `;

            }

        }
    );


    /* =====================================
       MODAL DELETE
    ====================================== */

    modalDeleteButton.addEventListener(
        "click",
        () => {

            if (
                selectedNotificationId === null
            ) {

                return;

            }


            deleteNotification(
                selectedNotificationId
            );

        }
    );


    /* =====================================
       CLOSE MODAL
    ====================================== */

    modalClose.addEventListener(
        "click",
        closeModal
    );


    modalOverlay.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !notificationModal.hidden
            ) {

                closeModal();

            }

        }
    );


    /* =====================================
       FILTER TABS
    ====================================== */

    document.querySelectorAll(
        ".notification-tab"
    ).forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".notification-tab"
                    )
                    .forEach(button => {

                        button.classList.remove(
                            "active"
                        );

                    });


                tab.classList.add(
                    "active"
                );


                currentFilter =
                    tab.dataset.filter;


                renderNotifications();

            }
        );

    });


    /* =====================================
       SEARCH
    ====================================== */

    searchInput.addEventListener(
        "input",
        renderNotifications
    );


    /* =====================================
       CLEAR FILTERS
    ====================================== */

    clearFilters.addEventListener(
        "click",
        () => {

            searchInput.value =
                "";

            currentFilter =
                "all";


            document
                .querySelectorAll(
                    ".notification-tab"
                )
                .forEach(
                    button => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


            document
                .querySelector(
                    '[data-filter="all"]'
                )
                .classList.add(
                    "active"
                );


            renderNotifications();

        }
    );


    /* =====================================
       MARK ALL
    ====================================== */

    markAllButton.addEventListener(
        "click",
        markAllAsRead
    );


    /* =====================================
       REFRESH
    ====================================== */

    async function loadNotifications() {

        refreshButton.classList.add(
            "loading"
        );


        try {

            /*
             * FUTURE BACKEND:
             *
             * const response =
             *     await fetch(
             *         "/api/student/notifications"
             *     );
             *
             * if (!response.ok) {
             *
             *     throw new Error(
             *         "Failed to load notifications"
             *     );
             *
             * }
             *
             * const data =
             *     await response.json();
             *
             * notifications =
             *     data.notifications;
             */


            /*
             * Temporary delay to simulate
             * server communication.
             */

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        400
                    )
            );


            updateCounters();

            renderNotifications();

        }

        catch (error) {

            console.error(
                "Unable to load notifications:",
                error
            );

        }

        finally {

            refreshButton.classList.remove(
                "loading"
            );

        }

    }


    refreshButton.addEventListener(
        "click",
        loadNotifications
    );


    /* =====================================
       MOBILE SIDEBAR
    ====================================== */

    function closeSidebar() {

        sidebar.classList.remove(
            "open"
        );

        sidebarOverlay.classList.remove(
            "active"
        );

    }


    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

            sidebarOverlay.classList.toggle(
                "active"
            );

        }
    );


    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );


    /* =====================================
       INITIALIZE
    ====================================== */

    loadNotifications();

});
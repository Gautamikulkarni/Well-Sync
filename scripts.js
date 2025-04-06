// // Toggles the hamburger menu with click

// document.querySelector('.hamburger').addEventListener('click', function() {
//     var navRight = document.getElementById('navbarRight');
//     if (navRight.style.left === "0px") {
//         navRight.style.left = "-100%"; // Slide out
//     } else {
//         navRight.style.left = "0"; // Slide in
//     }
// });

// document.querySelector('.hamburger').addEventListener('click', function() {
//     document.getElementById('navbarRight').style.left = "0"; // Slide in
// });

// document.querySelector('.closebtn').addEventListener('click', function() {
//     document.getElementById('navbarRight').style.left = "-100%"; // Slide out
// });

// function toggleSidebar() {
//     let sidebar = document.getElementById("sidebar");
//     if (sidebar.style.width === "250px") {
//       sidebar.style.width = "0";
//     } else {
//       sidebar.style.width = "250px";
//     }
//   }


// // Toggles the dropdown menu with click

// const dropBtn = document.getElementById('dropBtn');
// if (dropBtn) { // Check if the element actually exists
// const dropdownContent = document.querySelector('.dropdown-content');

// dropBtn.addEventListener('click', function() {
//     console.log('clicked');
//     if (dropdownContent.style.display === "none") {
//         dropdownContent.style.display = "block";
//     } else {
//         dropdownContent.style.display = "none";
//     }
//     console.log(dropdownContent);
// });
// }

// document.querySelectorAll('.faq-item').forEach(item => {
//     item.addEventListener('click', () => {
//         item.classList.toggle('active');
//         let answer = item.querySelector('.faq-answer');
//         let icon = item.querySelector('.faq-icon');
//         if (answer.style.display === "block") {
//             answer.style.display = "none";
//             icon.textContent = "+";
//         } else {
//             answer.style.display = "block";
//             icon.textContent = "−";
//         }
//     });
// });
// Toggles the hamburger menu with click

const hamburger = document.querySelector('.hamburger');
if (hamburger) {
    hamburger.addEventListener('click', function () {
        var navRight = document.getElementById('navbarRight');
        if (navRight.style.left === "0px") {
            navRight.style.left = "-100%"; // Slide out
        } else {
            navRight.style.left = "0"; // Slide in
        }
    });

    // Duplicate listener (optional to remove this one if above is enough)
    hamburger.addEventListener('click', function () {
        document.getElementById('navbarRight').style.left = "0"; // Slide in
    });
}

const closeBtn = document.querySelector('.closebtn');
if (closeBtn) {
    closeBtn.addEventListener('click', function () {
        document.getElementById('navbarRight').style.left = "-100%"; // Slide out
    });
}

function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

// Toggles the dropdown menu with click

const dropBtn = document.getElementById('dropBtn');
if (dropBtn) { // Check if the element actually exists
    const dropdownContent = document.querySelector('.dropdown-content');

    dropBtn.addEventListener('click', function () {
        console.log('clicked');
        if (dropdownContent.style.display === "none") {
            dropdownContent.style.display = "block";
        } else {
            dropdownContent.style.display = "none";
        }
        console.log(dropdownContent);
    });
}

const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            let answer = item.querySelector('.faq-answer');
            let icon = item.querySelector('.faq-icon');
            if (answer.style.display === "block") {
                answer.style.display = "none";
                icon.textContent = "+";
            } else {
                answer.style.display = "block";
                icon.textContent = "−";
            }
        });
    });
}

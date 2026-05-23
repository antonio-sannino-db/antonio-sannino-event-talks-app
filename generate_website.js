const fs = require('fs');

const talks = [
  {
    id: 'talk1',
    title: 'Introduction to WebAssembly',
    speakers: ['Alice Smith'],
    category: ['Web Development', 'Performance'],
    description: 'An overview of WebAssembly, its benefits, and how to get started with it in your web projects.',
    duration: 60 // minutes
  },
  {
    id: 'talk2',
    title: 'Modern CSS Techniques',
    speakers: ['Bob Johnson'],
    category: ['Frontend', 'UI/UX'],
    description: 'Explore the latest features in CSS, including Grid, Flexbox, custom properties, and more.',
    duration: 60 // minutes
  },
  {
    id: 'talk3',
    title: 'Building Scalable Node.js APIs',
    speakers: ['Charlie Brown', 'Dana White'],
    category: ['Backend', 'Node.js', 'API'],
    description: 'Best practices for designing and implementing high-performance, scalable APIs with Node.js and Express.',
    duration: 60 // minutes
  },
  {
    id: 'talk4',
    title: 'Demystifying Cloud Native Development',
    speakers: ['Eve Davis'],
    category: ['Cloud', 'DevOps'],
    description: 'Understand the core concepts of cloud-native development, containers, and Kubernetes.',
    duration: 60 // minutes
  },
  {
    id: 'talk5',
    title: 'Data Science with JavaScript',
    speakers: ['Frank Green'],
    category: ['Data Science', 'JavaScript'],
    description: 'Leverage the power of JavaScript for data analysis, visualization, and machine learning in the browser.',
    duration: 60 // minutes
  },
  {
    id: 'talk6',
    title: 'The Future of Frontend Frameworks',
    speakers: ['Grace Hoppper'],
    category: ['Frontend', 'Web Development', 'Trends'],
    description: 'A look at emerging trends and predictions for the next generation of frontend development frameworks.',
    duration: 60 // minutes
  },
];

const eventStartTime = new Date();
eventStartTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

const transitionDuration = 10; // minutes
const lunchBreakDuration = 60; // minutes

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function generateSchedule(talks, startTime, transition, lunchDuration) {
  const schedule = [];
  let currentTime = new Date(startTime);

  talks.forEach((talk, index) => {
    // Add talk to schedule
    const talkStartTime = new Date(currentTime);
    const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);
    schedule.push({
      type: 'talk',
      ...talk,
      startTime: formatTime(talkStartTime),
      endTime: formatTime(talkEndTime),
      rawStartTime: talkStartTime,
      rawEndTime: talkEndTime
    });
    currentTime = new Date(talkEndTime);

    // Add transition after each talk, except the last one
    if (index < talks.length - 1) {
      const transitionStartTime = new Date(currentTime);
      const transitionEndTime = new Date(currentTime.getTime() + transition * 60 * 1000);
      schedule.push({
        type: 'transition',
        startTime: formatTime(transitionStartTime),
        endTime: formatTime(transitionEndTime),
        duration: transition,
        description: 'Transition Break'
      });
      currentTime = new Date(transitionEndTime);
    }

    // Insert lunch break after the 3rd talk (index 2)
    if (index === 2) {
      const lunchStartTime = new Date(currentTime);
      const lunchEndTime = new Date(currentTime.getTime() + lunchDuration * 60 * 1000);
      schedule.push({
        type: 'lunch',
        startTime: formatTime(lunchStartTime),
        endTime: formatTime(lunchEndTime),
        duration: lunchDuration,
        description: 'Lunch Break'
      });
      currentTime = new Date(lunchEndTime);
    }
  });

  return schedule;
}

const fullSchedule = generateSchedule(talks, eventStartTime, transitionDuration, lunchBreakDuration);

// --- Node.js generates the schedule HTML content dynamically ---
let scheduleHtmlContent = '';
fullSchedule.forEach(item => {
    if (item.type === 'talk') {
        scheduleHtmlContent += `
            <div class="schedule-item talk-item" data-category="${item.category.map(c => c.toLowerCase()).join(' ')}">
                <h3>${item.startTime} - ${item.endTime}: ${item.title}</h3>
                <p class="speakers">Speaker(s): ${item.speakers.join(', ')}</p>
                <p class="category">Category: ${item.category.join(', ')}</p>
                <p>${item.description}</p>
            </div>
        `;
    } else if (item.type === 'lunch') {
        scheduleHtmlContent += `
            <div class="schedule-item break lunch-break">
                <h3>${item.startTime} - ${item.endTime}: Lunch Break (${item.duration} min)</h3>
                <p>${item.description}</p>
            </div>
        `;
    } else if (item.type === 'transition') {
        scheduleHtmlContent += `
            <div class="schedule-item break transition-break">
                <h3>${item.startTime} - ${item.endTime}: Transition (${item.duration} min)</h3>
                <p>${item.description}</p>
            </div>
        `;
    }
});
// --- End of Node.js HTML generation ---


const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>1-Day Tech Event Schedule</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: auto;
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1, h2 {
            color: #0056b3;
        }
        .search-container {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .search-container label {
            font-weight: bold;
            margin-right: 10px;
        }
        .search-container input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 70%;
            max-width: 300px;
        }
        .schedule-item {
            background: #e9ecef;
            margin-bottom: 15px;
            padding: 15px;
            border-radius: 5px;
            border-left: 5px solid #0056b3;
            transition: all 0.3s ease;
        }
        .schedule-item.hidden {
            display: none;
        }
        .schedule-item.break {
            background: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        .schedule-item h3 {
            margin-top: 0;
            color: #0056b3;
        }
        .schedule-item p {
            margin: 5px 0;
        }
        .schedule-item .speakers, .schedule-item .category {
            font-size: 0.9em;
            color: #666;
        }
        .schedule-item.break h3 {
            color: #dc3545;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.8em;
            color: #777;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .search-container input {
                width: 100%;
                margin-top: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>1-Day Tech Event Schedule</h1>
        <p>Join us for a day filled with exciting technical talks from industry experts!</p>

        <div class="search-container">
            <label for="categorySearch">Search by Category:</label>
            <input type="text" id="categorySearch" onkeyup="filterTalks()" placeholder="e.g., Web Development, Node.js">
        </div>

        <div id="schedule">
            ${scheduleHtmlContent}
        </div>

        <div class="footer">
            <p>&copy; 2026 1-Day Tech Event. All rights reserved.</p>
        </div>
    </div>

    <script>
        function filterTalks() {
            const searchInput = document.getElementById('categorySearch').value.toLowerCase();
            const talkItems = document.querySelectorAll('.talk-item');

            talkItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (category.includes(searchInput) || searchInput === '') {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }
    </script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlTemplate);
console.log('index.html has been generated successfully!');

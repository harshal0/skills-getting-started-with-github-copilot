document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Utility to create an activity card with participants section
  function createActivityCard(activityName, activityData) {
    const card = document.createElement("div");
    card.className = "activity-card";

    // Title
    const title = document.createElement("h4");
    title.textContent = activityName;
    card.appendChild(title);

    // Description
    const desc = document.createElement("p");
    desc.textContent = activityData.description;
    card.appendChild(desc);

    // Schedule
    const sched = document.createElement("p");
    sched.textContent = `Schedule: ${activityData.schedule}`;
    card.appendChild(sched);

    // Participants section
    const participantsSection = document.createElement("div");
    participantsSection.className = "participants-section";

    const participantsTitle = document.createElement("span");
    participantsTitle.className = "participants-title";
    participantsTitle.textContent = "Participants:";
    participantsSection.appendChild(participantsTitle);

    const participantsList = document.createElement("ul");
    participantsList.className = "participants-list";

    if (activityData.participants && activityData.participants.length > 0) {
      activityData.participants.forEach((email) => {
        const li = document.createElement("li");
        li.textContent = email;
        participantsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No participants yet.";
      li.style.color = "#888";
      participantsList.appendChild(li);
    }

    participantsSection.appendChild(participantsList);
    card.appendChild(participantsSection);

    return card;
  }

  // Render activities
  function renderActivities(activities) {
    activitiesList.innerHTML = "";
    Object.entries(activities).forEach(([name, data]) => {
      const card = createActivityCard(name, data);
      activitiesList.appendChild(card);
    });
  }

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      renderActivities(activities);

      // Populate activity select options
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
      Object.keys(activities).forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initial load
  fetchActivities();
});

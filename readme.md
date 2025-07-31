Here is the full README.md file in English, updated to include the video demo.webm from your /videos folder.

You can copy and paste this content directly into your README.md file.

README.md
Todo List Application - A Personal Task Manager
This Todo List application is a powerful personal task management tool designed to help you organize your daily tasks efficiently. With its intuitive interface and flexible features, you can easily add, edit, sort, and track your work.

✨ Key Features
User Authentication: Secure user authentication powered by Firebase, allowing you to manage your personal task list.

Add New Tasks: Easily create new tasks with a name, start date, and due date.

Drag & Drop: Reorder your tasks effortlessly using a flexible drag-and-drop interface.

Mark as Complete: Check off tasks to mark them as completed and track your progress.

Task Filtering: Filter tasks by their status (Completed, Uncompleted, All).

Customizable Colors: Personalize your tasks by assigning colors to help you categorize and organize your work visually.

Edit & Delete: Edit task details or remove tasks that are no longer needed.

Overdue Notifications: Visual indicators alert you when tasks are past their due date.

Clear All: Quickly clear your entire task list with a single click.

Cloud Storage: Data is securely stored in Firebase Firestore, ensuring it's safe and synchronized across all your devices.

🚀 Installation & Setup
This guide will walk you through the process of setting up and running the application on your local machine.

1. Prerequisites
Node.js (version 14 or later)

npm (comes bundled with Node.js)

A Firebase account to configure the database and authentication.

2. Project Setup
Clone the repository to your local machine:

Bash

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Install the required dependencies:

Bash

npm install
3. Firebase Configuration
Go to the Firebase Console and create a new project.

Set up Firestore Database and Authentication.

In your Project Settings, find the "Firebase SDK snippet" and select "Config" to get your configuration details.

Create a new file named .env in the root directory of your project and add the following configuration:

Đoạn mã

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_Messaginger_id
REACT_APP_FIREBASE_APP_ID=your_app_id
4. Running the Application
Use the following command to start the application in development mode:

Bash

npm start
The application will automatically open in your browser at http://localhost:3000.

🎬 Video Demonstration
Watch this short video to see the app in action.

Embedding the Local Video
Here is a short demo video showcasing the key features of the application.

HTML

<video width="100%" controls>
  <source src="./videos/demo.webm" type="video/webm">
  Your browser does not support the video tag.
</video>
If you have any questions or would like to contribute, feel free to open an issue on GitHub. Happy task managing!
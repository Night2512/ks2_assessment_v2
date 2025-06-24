document.addEventListener('DOMContentLoaded', () => {
    // --- Customizable Content (for Admins) ---
    const CUSTOM_CONTENT = {
        mainTitle: "Key Stage 2 Online Assessment - Mona Teaches",
        infoHeading: "Start Your Assessment",
        infoInstructions: "Please provide the following information to begin the assessment:",
        assessmentIntro: "The assessment has a 15 minute time limit. It will automatically submit once this time expires.",
        securityCheckText: "Please complete the security check above to enable the 'Start Assessment' button.",
        resultsHeading: "Assessment Results",
        emailSending: "Sending your detailed results email...",
        emailSentSuccess: "Email sent successfully! Please check your inbox (and spam folder).",
        emailFailed: "Failed to send email. Please contact support if this persists.",
        networkError: "Failed to send email: Network error. Please check your connection.",
        timeUpMessage: "Time's up! Your assessment has been automatically submitted.",
        expectationsBelow: "Below Expectations",
        expectationsMeets: "Meets Expectations",
        expectationsAbove: "Above Expectations",
        resultsEmailMessage: "Your full detailed results have been sent to your email address." // New custom message
    };

    // Apply customizable content
    document.getElementById('mainTitle').textContent = CUSTOM_CONTENT.mainTitle;
    document.getElementById('mainTitleReplicated').textContent = CUSTOM_CONTENT.mainTitle; // Update h1 as well
    document.getElementById('infoHeading').textContent = CUSTOM_CONTENT.infoHeading;
    document.getElementById('infoInstructions').textContent = CUSTOM_CONTENT.infoInstructions;
    document.getElementById('assessmentIntro').textContent = CUSTOM_CONTENT.assessmentIntro;
    document.getElementById('securityCheckText').textContent = CUSTOM_CONTENT.securityCheckText;
    document.getElementById('resultsHeading').textContent = CUSTOM_CONTENT.resultsHeading;


    // --- Elements ---
    const infoCollectionDiv = document.getElementById('infoCollection');
    const infoForm = document.getElementById('infoForm');
    const startAssessmentBtn = document.getElementById('startAssessmentBtn');
    const assessmentSectionDiv = document.getElementById('assessmentSection');
    const assessmentForm = document.getElementById('assessmentForm');
    const questionsContainer = document.getElementById('questionsContainer');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const submitAssessmentBtn = document.getElementById('submitAssessmentBtn');
    const resultsDiv = document.getElementById('results');
    const detailedResultsDiv = document.getElementById('detailedResults'); // This will be cleared
    const overallScoreElement = document.getElementById('overallScore');
    const overallExpectationsElement = document.getElementById('overallExpectations');
    const timerDisplay = document.getElementById('time');
    const emailStatus = document.getElementById('emailStatus');
    const currentQNumSpan = document.getElementById('currentQNum');
    const totalQNumSpan = document.getElementById('totalQNum');


    // --- User Info Storage ---
    let parentName = '';
    let childName = '';
    let parentEmail = '';

    let assessmentTextResults = ''; // To store plain text results for emailing
    let assessmentHtmlResults = ''; // To store HTML results for emailing
    const CURRENT_KEY_STAGE = "Key Stage 2"; // Define the current Key Stage

    // --- Timer Variables ---
    const totalTime = 15 * 60; // 15 minutes in seconds
    let timeLeft = totalTime;
    let timerInterval;
    let assessmentSubmittedByTime = false; // Flag to check if submitted by timer

    // --- Assessment Data (Extracted from your index.html and corrected with your provided answers) ---
    const questions = [
	  {
		"id": "q1",
		"type": "radio",
		"topicHeading": "Adverbs",
		"question": "Which word is an adverb?",
		"options": {
		  "a": "quickly",
		  "b": "beautiful",
		  "c": "jump"
		},
		"correctAnswer": "a",
		"correctAnswerDisplay": "quickly"
	  },
	  {
		"id": "q2",
		"type": "radio",
		"topicHeading": "Past Tense",
		"question": "Complete the sentence: \"She ______ to the shop yesterday.\"",
		"options": {
		  "a": "go",
		  "b": "goes",
		  "c": "went"
		},
		"correctAnswer": "c",
		"correctAnswerDisplay": "went"
	  },
	  {
		"id": "q3",
		"type": "text",
		"topicHeading": "Plurals",
		"question": "What is the correct plural of 'child'?",
		"correctAnswer": "children",
		"explanation": "The plural of 'child' is 'children'."
	  },
	  {
		"id": "q4",
		"type": "text",
		"topicHeading": "Possession (Apostrophes)",
		"question": "Rewrite this sentence using an apostrophe for possession: \"The car belonging to Tom is red.\"",
		"correctAnswer": "Tom's car is red.",
		"explanation": "The possessive form uses an apostrophe: 'Tom's car is red.'"
	  },
	  {
		"id": "q5",
		"type": "text",
		"topicHeading": "Verbs",
		"question": "Identify the main verb in the sentence: \"The birds are singing loudly.\"",
		"correctAnswer": "singing",
		"explanation": "The main verb describing the action is 'singing'."
	  },
	  {
		"id": "q6",
		"type": "radio",
		"topicHeading": "Punctuation",
		"question": "Which punctuation mark is missing from this sentence? \"What a lovely day\"",
		"options": {
		  "a": ". (Full stop)",
		  "b": "! (Exclamation mark)",
		  "c": "? (Question mark)"
		},
		"correctAnswer": "b",
		"correctAnswerDisplay": "! (Exclamation mark)"
	  },
	  {
		"id": "q7",
		"type": "text",
		"topicHeading": "Past Tense",
		"question": "Change to past tense: \"He walks to school.\"",
		"correctAnswer": "He walked to school.",
		"explanation": "The past tense of 'walks' is 'walked'."
	  },
	  {
		"id": "q8",
		"type": "text",
		"topicHeading": "Adjectives",
		"question": "Identify the adjective in: \"The clever fox jumped over the log.\"",
		"correctAnswer": "clever",
		"explanation": "'Clever' describes the fox, making it an adjective."
	  },
	  {
		"id": "q9",
		"type": "radio",
		"topicHeading": "Synonyms",
		"question": "Which word is a synonym for 'large'?",
		"options": {
		  "a": "small",
		  "b": "big",
		  "c": "tiny"
		},
		"correctAnswer": "b",
		"correctAnswerDisplay": "big"
	  },
	  {
		"id": "q10",
		"type": "text",
		"topicHeading": "Prepositions",
		"question": "Complete with a preposition: \"The book is ______ the table.\"",
		"correctAnswer": "on",
		"explanation": "'On' is a common preposition to describe the book's location relative to the table."
	  },
	  {
		"id": "q11",
		"type": "radio",
		"topicHeading": "Spelling",
		"question": "What is the correct spelling?",
		"options": {
		  "a": "recieved",
		  "b": "received",
		  "c": "recieveed"
		},
		"correctAnswer": "b",
		"correctAnswerDisplay": "received"
	  },
	  {
		"id": "q12",
		"type": "text",
		"topicHeading": "Punctuation (Commas)",
		"question": "Add a comma in the correct place: \"In the morning I eat breakfast.\"",
		"correctAnswer": "In the morning, I eat breakfast.",
		"explanation": "A comma is used after an introductory phrase like 'In the morning'."
	  },
	  {
		"id": "q13",
		"type": "text",
		"topicHeading": "Comparative Adjectives",
		"question": "What is the comparative form of 'good'?",
		"correctAnswer": "better",
		"explanation": "The comparative form of 'good' is 'better'."
	  },
	  {
		"id": "q14",
		"type": "text",
		"topicHeading": "Verbs",
		"question": "Identify the verb in: \"The children played happily in the park.\"",
		"correctAnswer": "played",
		"explanation": "'Played' is the verb, indicating the action performed by the children."
	  },
	  {
		"id": "q15",
		"type": "text",
		"topicHeading": "Punctuation (Question Mark)",
		"question": "Write a sentence using a question mark.",
		"correctAnswer": "Do you like to read?",
		"explanation": "An example sentence is 'Do you like to read?' (Any grammatically correct interrogative sentence ending with a question mark would be acceptable)."
	  },
	  {
		"id": "q16",
		"type": "number",
		"topicHeading": "Addition",
		"question": "What is 347 + 189?",
		"correctAnswer": 536,
		"explanation": "347 + 189 = 536."
	  },
	  {
		"id": "q17",
		"type": "number",
		"topicHeading": "Multiplication",
		"question": "What is 7 times 8?",
		"correctAnswer": 56,
		"explanation": "7 multiplied by 8 equals 56."
	  },
	  {
		"id": "q18",
		"type": "radio",
		"topicHeading": "Fractions",
		"question": "If a cake is divided into 4 equal slices, and you eat 1 slice, what fraction of the cake is left?",
		"options": {
		  "a": "1/4",
		  "b": "2/4",
		  "c": "3/4"
		},
		"correctAnswer": "c",
		"correctAnswerDisplay": "3/4"
	  },
	  {
		"id": "q19",
		"type": "number",
		"topicHeading": "Percentages",
		"question": "What is 25% of 80?",
		"correctAnswer": 20,
		"explanation": "25% of 80 is 20 (one-quarter of 80)."
	  },
	  {
		"id": "q20",
		"type": "number",
		"topicHeading": "Geometry (Angles)",
		"question": "Look at the image below. What is the value of angle 'x'?",
		"image": "images/angle_x.jpg",
		"imageAlt": "Image of a straight line with an angle labelled x and an adjacent angle of 60 degrees.",
		"correctAnswer": 120,
		"explanation": "Angles on a straight line add up to 180 degrees. So, 180 - 60 = 120."
	  },
	  {
		"id": "q21",
		"type": "number",
		"topicHeading": "Speed, Distance, Time",
		"question": "A car travels 120 miles in 2 hours. What is its average speed in miles per hour?",
		"correctAnswer": 60,
		"explanation": "Speed = Distance / Time. So, 120 miles / 2 hours = 60 mph."
	  },
	  {
		"id": "q22",
		"type": "number",
		"topicHeading": "Subtraction",
		"question": "Calculate 456 - 123.",
		"correctAnswer": 333,
		"explanation": "456 minus 123 equals 333."
	  },
	  {
		"id": "q23",
		"type": "number",
		"topicHeading": "Division",
		"question": "What is 60 divided by 5?",
		"correctAnswer": 12,
		"explanation": "60 divided by 5 equals 12."
	  },
	  {
		"id": "q24",
		"type": "number",
		"topicHeading": "Fractions to Decimals",
		"question": "Convert 1/2 to a decimal.",
		"correctAnswer": 0.5,
		"explanation": "1/2 as a decimal is 0.5."
	  },
	  {
		"id": "q25",
		"type": "number",
		"topicHeading": "Time Conversion",
		"question": "How many minutes are in 3 hours?",
		"correctAnswer": 180,
		"explanation": "There are 60 minutes in an hour, so 3 hours * 60 minutes/hour = 180 minutes."
	  },
	  {
		"id": "q26",
		"type": "number",
		"topicHeading": "Perimeter",
		"question": "What is the perimeter of a square with a side length of 7 cm?",
		"correctAnswer": 28,
		"explanation": "The perimeter of a square is 4 times its side length. So, 4 * 7 cm = 28 cm."
	  },
	  {
		"id": "q27",
		"type": "text",
		"topicHeading": "Ordering Numbers",
		"question": "Arrange these numbers from smallest to largest: 15, 7, 23, 10. (include commas)",
		"correctAnswer": "7,10,15,23",
		"explanation": "The numbers in order from smallest to largest are 7, 10, 15, 23."
	  },
	  {
		"id": "q28",
		"type": "number",
		"topicHeading": "Number Sequences",
		"question": "What is the next number in the sequence: 2, 4, 6, 8, ___?",
		"correctAnswer": 10,
		"explanation": "This is a sequence of even numbers, so the next number after 8 is 10."
	  },
	  {
		"id": "q29",
		"type": "number",
		"topicHeading": "Rounding",
		"question": "Round 347 to the nearest 10.",
		"correctAnswer": 350,
		"explanation": "347 rounded to the nearest 10 is 350."
	  },
	  {
		"id": "q30",
		"type": "text",
		"topicHeading": "Decimals to Fractions",
		"question": "What is 0.5 as a fraction?",
		"correctAnswer": "1/2",
		"explanation": "0.5 is equivalent to 1/2 as a fraction."
	  }
	];

    let userAnswers = {};
    let currentQuestionIndex = 0;

    // --- Functions ---

    // Progress Indicator Update
    function updateProgressIndicator() {
        currentQNumSpan.textContent = currentQuestionIndex + 1;
        totalQNumSpan.textContent = questions.length;
    }

    // Format time for display
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Start Timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                assessmentSubmittedByTime = true;
                submitAssessment(); // Auto-submit when time runs out
            }
        }, 1000);
    }

    // Show a specific question
    function showQuestion(index) {
        questionsContainer.innerHTML = ''; // Clear previous question
        const q = questions[index];
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';
        questionBlock.id = q.id;

        let questionHtml = '';

        // Add passage if it exists for this question
        if (q.passage) {
            questionHtml += `<div class="passage"><p>${q.passage}</p></div>`;
        }

        // Display topic heading and then question text
        questionHtml += `<h3>Q${index + 1}. ${q.topicHeading}</h3>`;
        questionHtml += `<p class="question-text-content">${q.question}</p>`;


        // Add image if specified in question object
        if (q.image) {
            questionHtml += `<img src="${q.image}" alt="${q.imageAlt}" style="max-width: 150px; display: block; margin-bottom: 15px;">`; // Increased margin-bottom
        }

        if (q.type === 'radio') {
            for (const optionKey in q.options) {
                questionHtml += `
                    <div>
                        <label>
                            <input type="radio" name="${q.id}_answer" value="${optionKey}" ${userAnswers[q.id] === optionKey ? 'checked' : ''}>
                            ${optionKey}) ${q.options[optionKey]}
                        </label>
                    </div>
                `;
            }
        } else if (q.type === 'text') {
            questionHtml += `
                <input type="text" name="${q.id}_answer" placeholder="Enter your answer" value="${userAnswers[q.id] || ''}">
            `;
        } else if (q.type === 'number') {
            questionHtml += `
                <input type="number" name="${q.id}_answer" placeholder="Enter number" value="${userAnswers[q.id] || ''}">
            `;
        }
        questionBlock.innerHTML = questionHtml;
        questionsContainer.appendChild(questionBlock);

        // Update progress indicator
        updateProgressIndicator();

        // Manage button visibility
        if (currentQuestionIndex === questions.length - 1) {
            nextQuestionBtn.style.display = 'none';
            submitAssessmentBtn.style.display = 'block';
        } else {
            nextQuestionBtn.style.display = 'block';
            submitAssessmentBtn.style.display = 'none';
        }
    }

    // Handle moving to the next question
    function nextQuestion() {
        // Save current answer
        const currentQ = questions[currentQuestionIndex];
        let answerInput;
        if (currentQ.type === 'radio') {
            answerInput = document.querySelector(`input[name="${currentQ.id}_answer"]:checked`);
            userAnswers[currentQ.id] = answerInput ? answerInput.value : '';
        } else {
            answerInput = document.querySelector(`[name="${currentQ.id}_answer"]`);
            userAnswers[currentQ.id] = answerInput ? answerInput.value : '';
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
        }
    }

    // Submit Assessment
    async function submitAssessment() {
        clearInterval(timerInterval); // Stop the timer

        // Save the answer for the last question
        const currentQ = questions[currentQuestionIndex];
        let answerInput;
        if (currentQ.type === 'radio') {
            answerInput = document.querySelector(`input[name="${currentQ.id}_answer"]:checked`);
            userAnswers[currentQ.id] = answerInput ? answerInput.value : '';
        } else {
            answerInput = document.querySelector(`[name="${currentQ.id}_answer"]`);
            userAnswers[currentQ.id] = answerInput ? answerInput.value : '';
        }

        assessmentSectionDiv.style.display = 'none';
        resultsDiv.style.display = 'block';

        let score = 0;
        let resultsHtmlEmailContent = ''; // This will store the detailed HTML for email
        let resultsTextContent = `Detailed Results:\n`;
        const scoreThresholds = {
            below: questions.length * 0.33, // Example: Below 33% is Below Expectations
            meets: questions.length * 0.66  // Example: 33-65% is Meets, >= 66% is Above
        };


        questions.forEach((q, index) => {
            const userAnswer = userAnswers[q.id];
            let isCorrect = false;
            let explanation = q.explanation || '';
            let userAnswerDisplay = userAnswer === '' ? 'No Answer' : userAnswer;
            let questionScore = 0; // 0 or 1 for each question

            if (q.type === 'radio') {
                isCorrect = userAnswer === q.correctAnswer;
                if (userAnswer && q.options[userAnswer]) {
                    userAnswerDisplay = q.options[userAnswer]; // Display the option text, not just the key
                }
            } else if (q.type === 'text') {
                if (q.id === 'q12') {
                    // Custom logic for Q12: Must start with a capital letter, contain 'blue', and end with a full stop
                    const trimmedAnswer = userAnswer.trim();
                    isCorrect = trimmedAnswer.length > 0 &&
                                trimmedAnswer[0] === trimmedAnswer[0].toUpperCase() &&
                                /[A-Z]/.test(trimmedAnswer[0]) && // Ensure the first char is an actual letter
                                trimmedAnswer.toLowerCase().includes('blue') &&
                                trimmedAnswer.endsWith('.');
                } else {
                    isCorrect = userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                }
            } else if (q.type === 'number') {
                isCorrect = parseInt(userAnswer) === q.correctAnswer;
            }

            if (isCorrect) {
                score++;
                questionScore = 1;
            }

            // Prepare HTML results (for email) based on the provided sample
            resultsHtmlEmailContent += `
                <div class="question-item">
                    <h4>Q${index + 1}. ${q.topicHeading}</h4>
                    <p>${q.question}</p> <p><strong>Your Answer:</strong> ${userAnswerDisplay}</p>
                    <p><strong>Correct Answer:</strong> ${q.correctAnswerDisplay || q.correctAnswer}</p>
                    <p><strong>Score:</strong> ${questionScore}/1</p>
                    <p><strong>Outcome:</strong> <span class="${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? 'Correct' : 'Incorrect'}</span></p>
                    ${explanation ? `<p>Explanation: ${explanation}</p>` : ''}
                </div>
            `;

            // Prepare Plain Text results (for email)
            resultsTextContent += `\nQuestion ${index + 1}: ${q.topicHeading} - ${q.question}\n`;
            resultsTextContent += `Your Answer: ${userAnswerDisplay} (${isCorrect ? 'Correct' : 'Incorrect'})\n`;
            resultsTextContent += `Correct Answer: ${q.correctAnswerDisplay || q.correctAnswer}\n`;
            if (explanation) {
                resultsTextContent += `Explanation: ${explanation}\n`;
            }
        });

        // ONLY SHOW SUMMARY ON RESULTS PAGE
        detailedResultsDiv.innerHTML = `<p>${CUSTOM_CONTENT.resultsEmailMessage}</p>`; // Display custom message
        overallScoreElement.textContent = `Overall Score: ${score}/${questions.length}`;

        let overallExpectations = '';
        let expectationsClass = ''; // To apply correct CSS class in email
        if (score < scoreThresholds.below) {
            overallExpectations = CUSTOM_CONTENT.expectationsBelow;
            expectationsClass = 'expectation-below';
        } else if (score >= scoreThresholds.meets) {
            overallExpectations = CUSTOM_CONTENT.expectationsAbove;
            expectationsClass = 'expectation-above';
        } else {
            overallExpectations = CUSTOM_CONTENT.expectationsMeets;
            expectationsClass = 'expectation-meets';
        }
        overallExpectationsElement.textContent = `Overall Performance: ${overallExpectations}`;

        // Add auto-submit message if applicable
        if (assessmentSubmittedByTime) {
            const autoSubmitMessage = document.createElement('p');
            autoSubmitMessage.textContent = CUSTOM_CONTENT.timeUpMessage;
            autoSubmitMessage.style.color = '#dc3545'; // Red for emphasis
            autoSubmitMessage.style.fontWeight = 'bold';
            overallScoreElement.parentNode.insertBefore(autoSubmitMessage, overallScoreElement.nextSibling);
        }

        // Store results for emailing
        assessmentTextResults = `
Child's Name: ${childName}
Parent's Name: ${parentName}
Parent's Email: ${parentEmail}

Overall Score: ${score}/${questions.length}
Overall Performance: ${overallExpectations}

${resultsTextContent}
        `;

        // Full HTML for email based on provided sample
        assessmentHtmlResults = `
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; }
    h2, h3, h4 { color: #0056b3; }
    .question-item { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #eee; }
    .question-item:last-child { border-bottom: none; }
    .score-summary { text-align: center; margin-top: 25px; padding-top: 15px; border-top: 2px solid #007bff; }
    .correct { color: green; }
    .incorrect { color: red; }
    .expectation-meets { color: #28a745; font-weight: bold; }
    .expectation-below { color: #dc3545; font-weight: bold; }
    .expectation-above { color: #007bff; font-weight: bold; }
</style>
</head>
<body>
    <div class="container">
        <h2>${CURRENT_KEY_STAGE} Assessment Results for ${childName}</h2>
        <p><strong>Parent Name:</strong> ${parentName}</p>
        <p><strong>Parent Email:</strong> ${parentEmail}</p>
        <p><strong>Overall Score:</strong> ${score}/${questions.length}</p>
        <p><strong>Overall Performance:</strong> <span class="${expectationsClass}">${overallExpectations}</span></p>
        ${assessmentSubmittedByTime ? `<p style="color:#dc3545;font-weight:bold;">${CUSTOM_CONTENT.timeUpMessage}</p>` : ''}
        
        ${resultsHtmlEmailContent} <div class="score-summary">
            <h3>Overall Score: ${score}/${questions.length}</h3>
            <h3>Overall Outcome: <span class="${expectationsClass}">${overallExpectations}</span></h3>
        </div>
        <p>If you have any questions, please reply to this email.</p>
        <p>Best regards,<br>Mona Teaches</p>
    </div>
</body>
</html>
        `;

        // Immediately send results email and save to DB
        sendEmail(parentName, childName, parentEmail, assessmentTextResults, assessmentHtmlResults);
        saveSubmission(parentName, childName, parentEmail, score, overallExpectations, userAnswers);
    }

    // Send email function
    async function sendEmail(parentName, childName, parentEmail, resultsText, resultsHtml) {
        emailStatus.textContent = CUSTOM_CONTENT.emailSending;
        emailStatus.style.color = '#007bff'; // Blue for sending

        try {
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parentName: parentName,
                    childName: childName,
                    parentEmail: parentEmail,
                    resultsText: resultsText, // Pass plain text results
                    resultsHtml: resultsHtml,
                    keyStage: CURRENT_KEY_STAGE  // Pass HTML results
                }),
            });

            if (response.ok) {
                emailStatus.textContent = CUSTOM_CONTENT.emailSentSuccess;
                emailStatus.style.color = '#28a745'; // Green for success
            } else {
                const errorData = await response.json();
                console.error('Error sending email:', errorData.message);
                emailStatus.textContent = `${CUSTOM_CONTENT.emailFailed}: ${errorData.message || 'Server error'}`;
                emailStatus.style.color = '#dc3545'; // Red for error
            }
        } catch (error) {
            console.error('Network or unexpected error:', error);
            emailStatus.textContent = `${CUSTOM_CONTENT.networkError}`;
            emailStatus.style.color = '#dc3545'; // Red for error
        }
    }

    // Save submission to database function
	async function saveSubmission(parentName, childName, parentEmail, score, expectations, userAnswers) {
		const totalQuestions = questions.length; // Add this line
		try {
			const response = await fetch('/.netlify/functions/save-submission', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					parentName,
					childName,
					parentEmail,
					score,
					expectations,
					detailedResults: userAnswers,
					totalQuestions: totalQuestions // Add this line
				}),
			});
			// ... rest of your saveSubmission function
		} catch (error) {
			// ...
		}
	}

    // --- Event Listeners ---

    // Info Form Submission
    infoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Save user info
        parentName = document.getElementById('parentName').value;
        childName = document.getElementById('childName').value;
        parentEmail = document.getElementById('parentEmail').value;

        infoCollectionDiv.style.display = 'none';
        assessmentSectionDiv.style.display = 'block';

        showQuestion(currentQuestionIndex);
        startTimer();
    });

    // Cloudflare Turnstile Callback
    window.turnstileCallback = function(token) {
        // Verify token server-side (optional but recommended)
        fetch('/.netlify/functions/verify-turnstile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ turnstileToken: token })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                startAssessmentBtn.disabled = false;
            } else {
                startAssessmentBtn.disabled = true;
                console.error('Turnstile verification failed:', data.errors);
                alert('Security check failed. Please try again.');
            }
        })
        .catch(error => {
            startAssessmentBtn.disabled = true;
            console.error('Error verifying Turnstile:', error);
            alert('An error occurred during security verification. Please try again.');
        });
    };

    window.turnstileErrorCallback = function() {
        startAssessmentBtn.disabled = true;
        console.error('Turnstile widget encountered an error.');
        alert('There was an issue loading the security check. Please refresh the page.');
    };

    // Next Question Button
    nextQuestionBtn.addEventListener('click', nextQuestion);

    // Assessment Form Submission (for final submit button)
    assessmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitAssessment();
    });
});
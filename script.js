// Loan Eligibility Calculator
const LoanCalculator = {
    // Personal Loan Scoring Weights
    personalLoanWeights: {
        income: 0.25,
        familyIncome: 0.15,
        expenses: 0.15,
        savings: 0.15,
        employment: 0.15,
        existingLoans: 0.15
    },

    // Home Loan Scoring Weights
    homeLoanWeights: {
        income: 0.2,
        propertyValue: 0.2,
        locality: 0.15,
        employmentDuration: 0.15,
        downPayment: 0.15,
        existingLoans: 0.15
    },

    // Education Loan Scoring Weights
    educationLoanWeights: {
        parentsIncome: 0.2,
        courseField: 0.2,
        institutionRating: 0.2,
        academicScore: 0.15,
        loanAmount: 0.15,
        collateral: 0.1
    },

    // Calculate Personal Loan Score
    calculatePersonalLoanScore(formData) {
        let score = 0;
        const income = parseFloat(formData.get('income')) || 0;
        const familyIncome = parseFloat(formData.get('family-income')) || 0;
        const expenses = parseFloat(formData.get('monthly-expenses')) || 0;
        const savings = parseFloat(formData.get('savings')) || 0;

        // Income Score (0-100)
        const incomeScore = Math.min((income / 50000) * 100, 100);
        score += incomeScore * this.personalLoanWeights.income;

        // Family Income Score
        const familyIncomeScore = Math.min((familyIncome / 100000) * 100, 100);
        score += familyIncomeScore * this.personalLoanWeights.familyIncome;

        // Expenses to Income Ratio Score
        const expenseRatio = expenses / income;
        const expenseScore = Math.max(100 - (expenseRatio * 100), 0);
        score += expenseScore * this.personalLoanWeights.expenses;

        // Savings Score
        const savingsScore = Math.min((savings / (income * 6)) * 100, 100);
        score += savingsScore * this.personalLoanWeights.savings;

        // Employment Status Score
        const employmentStatus = formData.get('employment-status');
        const employmentScore = employmentStatus === 'permanent' ? 100 : 
                              employmentStatus === 'contract' ? 70 : 
                              employmentStatus === 'self-employed' ? 60 : 30;
        score += employmentScore * this.personalLoanWeights.employment;

        // Existing Loans Score
        const hasExistingLoans = formData.get('existing-loans') === 'yes';
        const existingLoansScore = hasExistingLoans ? 50 : 100;
        score += existingLoansScore * this.personalLoanWeights.existingLoans;

        return Math.round(score);
    },

    // Calculate Home Loan Score
    calculateHomeLoanScore(formData) {
        let score = 0;
        const income = parseFloat(formData.get('home-income')) || 0;
        const propertyValue = parseFloat(formData.get('property-value')) || 0;
        const downPayment = parseFloat(formData.get('down-payment')) || 0;
        const employmentDuration = parseFloat(formData.get('employment-duration')) || 0;

        // Income Score
        const incomeScore = Math.min((income / 100000) * 100, 100);
        score += incomeScore * this.homeLoanWeights.income;

        // Property Value to Loan Ratio Score
        const loanAmount = propertyValue - downPayment;
        const ltv = (loanAmount / propertyValue) * 100;
        const propertyScore = Math.max(100 - ltv, 0);
        score += propertyScore * this.homeLoanWeights.propertyValue;

        // Locality Score
        const locality = formData.get('locality');
        const localityScore = locality === 'urban' ? 100 :
                            locality === 'suburban' ? 80 :
                            locality === 'rural' ? 60 : 50;
        score += localityScore * this.homeLoanWeights.locality;

        // Employment Duration Score
        const employmentScore = Math.min((employmentDuration / 5) * 100, 100);
        score += employmentScore * this.homeLoanWeights.employmentDuration;

        // Down Payment Ratio Score
        const downPaymentRatio = (downPayment / propertyValue) * 100;
        const downPaymentScore = Math.min(downPaymentRatio * 2, 100);
        score += downPaymentScore * this.homeLoanWeights.downPayment;

        // Existing Loans Score
        const hasExistingLoans = formData.get('existing-loans') === 'yes';
        const existingLoansScore = hasExistingLoans ? 50 : 100;
        score += existingLoansScore * this.homeLoanWeights.existingLoans;

        return Math.round(score);
    },

    // Calculate Education Loan Score
    calculateEducationLoanScore(formData) {
        let score = 0;
        const parentsIncome = parseFloat(formData.get('parents-income')) || 0;
        const tuitionFee = parseFloat(formData.get('tuition-fee')) || 0;
        const examScore = parseFloat(formData.get('exam-scores')) || 0;

        // Parents Income Score
        const incomeScore = Math.min((parentsIncome / 100000) * 100, 100);
        score += incomeScore * this.educationLoanWeights.parentsIncome;

        // Course Field Score
        const courseField = formData.get('course-field');
        const fieldScore = courseField === 'engineering' || courseField === 'medical' ? 100 :
                          courseField === 'business' ? 90 :
                          courseField === 'science' ? 85 :
                          courseField === 'arts' ? 80 : 75;
        score += fieldScore * this.educationLoanWeights.courseField;

        // Institution Rating (based on admission status)
        const admissionStatus = formData.get('admission-status');
        const institutionScore = admissionStatus === 'yes' ? 100 : 60;
        score += institutionScore * this.educationLoanWeights.institutionRating;

        // Academic Score
        const academicScore = Math.min((examScore / 100) * 100, 100);
        score += academicScore * this.educationLoanWeights.academicScore;

        // Loan Amount to Income Ratio Score
        const loanAmountRatio = tuitionFee / parentsIncome;
        const loanScore = Math.max(100 - (loanAmountRatio * 50), 0);
        score += loanScore * this.educationLoanWeights.loanAmount;

        // Scholarship/Support Score
        const hasScholarship = formData.get('scholarships') === 'yes';
        const hasParentalSupport = formData.get('parental-support') === 'yes';
        const supportScore = (hasScholarship && hasParentalSupport) ? 100 :
                           (hasScholarship || hasParentalSupport) ? 75 : 50;
        score += supportScore * this.educationLoanWeights.collateral;

        return Math.round(score);
    }
};

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', () => {
    // Form Validation
    const validateForm = (formData) => {
        const requiredFields = ['fullName', 'email', 'phone'];
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                throw new Error(`Please fill in all required fields: ${field}`);
            }
        }

        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Please enter a valid email address');
        }

        const phone = formData.get('phone');
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error('Please enter a valid 10-digit phone number');
        }
    };

    // Handle Form Submission
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            validateForm(formData);

            let score = 0;
            let loanType = '';
            
            // Calculate score based on loan type
            if (form.id === 'personalLoanForm') {
                score = LoanCalculator.calculatePersonalLoanScore(formData);
                loanType = 'Personal';
            } else if (form.id === 'homeLoanForm') {
                score = LoanCalculator.calculateHomeLoanScore(formData);
                loanType = 'Home';
            } else if (form.id === 'educationLoanForm') {
                score = LoanCalculator.calculateEducationLoanScore(formData);
                loanType = 'Education';
            }

            // Determine eligibility and maximum loan amount
            const isEligible = score >= 60;
            const requestedAmount = parseFloat(formData.get('loan-amount')) || 0;
            const eligibleAmount = isEligible ? Math.round(requestedAmount * (score / 100)) : 0;
            const interestRate = 12 - (Math.floor(score / 10) * 0.5); // Base rate 12%, reduces by 0.5% for every 10 points

            // Redirect to result page with parameters
            const params = new URLSearchParams({
                eligible: isEligible,
                score: score,
                loanType: loanType,
                amount: requestedAmount,
                eligibleAmount: eligibleAmount,
                interestRate: interestRate.toFixed(2)
            });

            window.location.href = `result.html?${params.toString()}`;

        } catch (error) {
            alert(error.message);
        }
    };

    // Attach submit handlers to forms
    const forms = ['personalLoanForm', 'homeLoanForm', 'educationLoanForm'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
    });

    // Dynamic form interactions
    const setupDynamicFormFields = () => {
        // Toggle existing loan details
        const existingLoansSelect = document.getElementById('existing-loans');
        const existingLoanDetails = document.getElementById('existing-loan-details');
        
        if (existingLoansSelect && existingLoanDetails) {
            existingLoansSelect.addEventListener('change', (e) => {
                existingLoanDetails.style.display = e.target.value === 'yes' ? 'block' : 'none';
            });
        }

        // Format currency inputs
        const currencyInputs = document.querySelectorAll('input[type="number"]');
        currencyInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                    e.target.value = Math.round(value);
                }
            });
        });
    };

    setupDynamicFormFields();
});
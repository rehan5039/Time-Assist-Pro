// DOM Elements
const welcomeCard = document.getElementById('welcomeCard');
const closeWelcome = document.getElementById('closeWelcome');
const emailInput = document.getElementById('emailInput');
const emailError = document.getElementById('emailError');
const generateButton = document.getElementById('generateButton');
const buttonText = generateButton.querySelector('.button-text');
const buttonLoader = generateButton.querySelector('.button-loader');
const emailList = document.getElementById('emailList');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.getElementById('resultsSection');
const copyAllButton = document.getElementById('copyAllButton');
const downloadButton = document.getElementById('downloadButton');
const toast = document.getElementById('toast');
const toastMessage = toast.querySelector('.toast-message');

// Stats Elements
const statsCard = document.getElementById('statsCard');
const totalAliasesElement = document.getElementById('totalAliases');
const dotCountElement = document.getElementById('dotCount');
const prefixCountElement = document.getElementById('prefixCount');
const suffixCountElement = document.getElementById('suffixCount');

// Settings Elements
const dotVariationsCheckbox = document.getElementById('dotVariations');
const prefixVariationsCheckbox = document.getElementById('prefixVariations');
const suffixVariationsCheckbox = document.getElementById('suffixVariations');
const yearVariationsCheckbox = document.getElementById('yearVariations');
const maxVariationsSlider = document.getElementById('maxVariations');
const maxVariationsValue = document.getElementById('maxVariationsValue');

// Settings Controls
const settingsButton = document.getElementById('settingsButton');
const settingsMenu = document.getElementById('settingsMenu');
const closeSettings = document.getElementById('closeSettings');
const themeToggle = document.getElementById('themeToggle');
const viewToggle = document.getElementById('viewToggle');

// User Manual Functionality
const userManualButton = document.getElementById('userManualButton');
const userManualModal = document.getElementById('userManualModal');
const closeManual = document.getElementById('closeManual');

userManualButton.addEventListener('click', (e) => {
    e.preventDefault();
    userManualModal.classList.add('show');
    // Add a nice animation to the email icon
    const emailIcon = userManualButton.querySelector('.material-icons-round');
    emailIcon.style.transform = 'scale(1.2) rotate(-10deg)';
    setTimeout(() => {
        emailIcon.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
});

closeManual.addEventListener('click', () => {
    userManualModal.classList.remove('show');
});

// Close modal when clicking outside
userManualModal.addEventListener('click', (e) => {
    if (e.target === userManualModal) {
        userManualModal.classList.remove('show');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && userManualModal.classList.contains('show')) {
        userManualModal.classList.remove('show');
    }
});

// Set default preferences (always start in light mode)
document.documentElement.setAttribute('data-theme', 'light');
document.documentElement.setAttribute('data-view', localStorage.getItem('view') || 'expanded');
document.documentElement.setAttribute('data-color-scheme', localStorage.getItem('colorScheme') || 'default');

// Initialize UI state
const updateUIState = () => {
    // Theme state
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('.theme-icon');
        const themeText = themeToggle.querySelector('.option-text');
        
        if (themeIcon) {
            themeIcon.textContent = currentTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }
        if (themeText) {
            themeText.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }

    // View state
    const currentView = document.documentElement.getAttribute('data-view');
    if (viewToggle) {
        const viewIcon = viewToggle.querySelector('.material-icons-round');
        const viewText = viewToggle.querySelector('span:last-child');
        
        if (viewIcon) {
            viewIcon.textContent = currentView === 'compact' ? 'view_agenda' : 'view_compact';
        }
        if (viewText) {
            viewText.textContent = currentView === 'compact' ? 'Expanded View' : 'Compact View';
        }
    }
};

// Initialize UI
updateUIState();

// Update max variations value display
maxVariationsSlider.addEventListener('input', () => {
    maxVariationsValue.textContent = maxVariationsSlider.value;
});

// Validate email input
function isValidGmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}

// Show toast message
function showToast(message, duration = 3000) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy to clipboard');
    }
}

// Download aliases as text file
function downloadAliases(aliases) {
    const content = aliases.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gmail-aliases.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Aliases downloaded!');
}

// Generate dot variations
function generateDotVariations(localPart) {
    const positions = [];
    for (let i = 1; i < localPart.length; i++) {
        positions.push(i);
    }
    
    const variations = new Set([localPart]);
    const maxDots = positions.length;
    
    for (let i = 1; i <= maxDots; i++) {
        const combos = getCombinations(positions, i);
        for (const combo of combos) {
            let variation = localPart;
            let offset = 0;
            for (const pos of combo) {
                variation = variation.slice(0, pos + offset) + '.' + variation.slice(pos + offset);
                offset++;
            }
            variations.add(variation);
        }
    }
    
    return Array.from(variations);
}

// Generate prefix variations
function generatePrefixVariations(localPart) {
    const prefixes = [
        'info', 'contact', 'admin', 'support', 'noreply',
        'hello', 'help', 'sales', 'billing', 'marketing', 'team',
        'service', 'account', 'newsletter', 'notifications', 'alerts',
        'feedback', 'enquiry', 'inquiry', 'jobs', 'careers', 'hr',
        'dev', 'developer', 'tech', 'test', 'testing', 'qa',
        'security', 'privacy', 'legal', 'media', 'press', 'news'
    ];
    
    const variations = new Set();
    prefixes.forEach(prefix => {
        variations.add(`${prefix}.${localPart}`);
    });
    
    return Array.from(variations);
}

// Generate suffix variations
function generateSuffixVariations(localPart) {
    const suffixes = [
        'work', 'personal', 'social', 'shopping', 'spam',
        'business', 'private', 'public', 'family', 'friends',
        'gaming', 'education', 'school', 'college', 'uni',
        'finance', 'bank', 'bills', 'subscriptions', 'newsletters',
        'travel', 'booking', 'hotel', 'flight', 'vacation',
        'temp', 'temporary', 'old', 'new', 'archive',
        'primary', 'secondary', 'backup', 'recovery', 'secure'
    ];
    
    const variations = new Set();
    suffixes.forEach(suffix => {
        variations.add(`${localPart}.${suffix}`);
    });
    
    return Array.from(variations);
}

// Generate year variations
function generateYearVariations(localPart) {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = 2020; year <= currentYear + 2; year++) {
        years.push(year);
        years.push(year % 100);
    }
    
    const variations = new Set();
    years.forEach(year => {
        variations.add(`${localPart}${year}`);
        variations.add(`${localPart}.${year}`);
        variations.add(`${localPart}+${year}`);
    });
    
    return Array.from(variations);
}

// Get combinations helper function
function getCombinations(arr, k) {
    const combinations = [];
    
    function backtrack(start, combo) {
        if (combo.length === k) {
            combinations.push([...combo]);
            return;
        }
        
        for (let i = start; i < arr.length; i++) {
            combo.push(arr[i]);
            backtrack(i + 1, combo);
            combo.pop();
        }
    }
    
    backtrack(0, []);
    return combinations;
}

// Create email item element
function createEmailItem(email) {
    const emailCard = document.createElement('div');
    emailCard.className = 'email-card';

    const emailContent = document.createElement('div');
    emailContent.className = 'email-content';

    const emailText = document.createElement('span');
    emailText.className = 'email-text';
    emailText.textContent = email;

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.title = 'Copy to clipboard';
    copyButton.innerHTML = '<span class="material-icons-round">content_copy</span>';
    
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(email).then(() => {
            showToast('Email copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy email');
        });
    });

    emailContent.appendChild(emailText);
    emailContent.appendChild(copyButton);
    emailCard.appendChild(emailContent);

    return emailCard;
}

// Generate email aliases
function generateAliases(email) {
    const [localPart, domain] = email.split('@');
    let allVariations = [];
    
    if (dotVariationsCheckbox.checked) {
        const dotVariations = generateDotVariations(localPart);
        allVariations.push(...dotVariations.map(v => `${v}@${domain}`));
    }
    
    if (prefixVariationsCheckbox.checked) {
        const prefixVariations = generatePrefixVariations(localPart);
        allVariations.push(...prefixVariations.map(v => `${v}@${domain}`));
    }
    
    if (suffixVariationsCheckbox.checked) {
        const suffixVariations = generateSuffixVariations(localPart);
        allVariations.push(...suffixVariations.map(v => `${v}@${domain}`));
    }
    
    if (yearVariationsCheckbox.checked) {
        const yearVariations = generateYearVariations(localPart);
        allVariations.push(...yearVariations.map(v => `${v}@${domain}`));
    }
    
    allVariations = [email, ...new Set(allVariations)];
    
    const maxVariations = parseInt(maxVariationsSlider.value);
    if (allVariations.length <= maxVariations) {
        return allVariations;
    }
    
    const result = [email];
    const remainingVariations = allVariations.filter(v => v !== email);
    
    while (result.length < maxVariations && remainingVariations.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingVariations.length);
        result.push(remainingVariations.splice(randomIndex, 1)[0]);
    }
    
    return result;
}

// Update statistics
function updateStats(aliases) {
    const email = emailInput.value;
    const [localPart] = email.split('@');
    
    const dotCount = aliases.filter(alias => alias.includes('.')).length;
    const prefixCount = aliases.filter(alias => alias.includes('+')).length;
    const suffixCount = aliases.filter(alias => 
        alias.includes('+') && alias.indexOf(localPart) === 0
    ).length;
    
    totalAliasesElement.textContent = aliases.length;
    dotCountElement.textContent = dotCount;
    prefixCountElement.textContent = prefixCount - suffixCount;
    suffixCountElement.textContent = suffixCount;
}

// Handle generate button click
generateButton.addEventListener('click', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Please enter an email address');
        return;
    }
    
    if (!isValidGmail(email)) {
        showToast('Please enter a valid Gmail address');
        return;
    }
    
    generateButton.disabled = true;
    buttonText.textContent = 'Generating...';
    buttonLoader.style.display = 'block';

    emailList.innerHTML = '';
    resultsSection.style.display = 'none';

    setTimeout(() => {
        const aliases = generateAliases(email);
        
        aliases.forEach(alias => {
            emailList.appendChild(createEmailItem(alias));
        });

        updateStats(aliases);

        resultsSection.style.display = 'block';

        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        generateButton.disabled = false;
        buttonText.textContent = 'Generate Aliases';
        buttonLoader.style.display = 'none';
        
        copyAllButton.onclick = () => copyToClipboard(aliases.join('\n'));
        
        downloadButton.onclick = () => downloadAliases(aliases);
        
    }, 1000); // Simulate processing time
});

// Add input validation
emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    const errorElement = document.getElementById('emailError');
    
    if (!isValidGmail(email)) {
        errorElement.textContent = 'Please enter a valid Gmail address';
        generateButton.disabled = true;
    } else {
        errorElement.textContent = '';
        generateButton.disabled = false;
    }
});

// Settings menu handlers
if (settingsButton) {
    settingsButton.addEventListener('click', () => {
        settingsMenu.classList.add('show');
    });
}

if (closeSettings) {
    closeSettings.addEventListener('click', () => {
        settingsMenu.classList.remove('show');
    });
}

// Close settings when clicking outside
document.addEventListener('click', (e) => {
    if (settingsMenu && !settingsMenu.contains(e.target) && !settingsButton.contains(e.target)) {
        settingsMenu.classList.remove('show');
    }
});

// Theme toggle handler
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update the icon and text
        const themeIcon = themeToggle.querySelector('.theme-icon');
        const themeText = themeToggle.querySelector('.option-text');
        
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }
        if (themeText) {
            themeText.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    });
}

// View toggle handler
if (viewToggle) {
    viewToggle.addEventListener('click', () => {
        const currentView = document.documentElement.getAttribute('data-view');
        const newView = currentView === 'compact' ? 'expanded' : 'compact';
        document.documentElement.setAttribute('data-view', newView);
        localStorage.setItem('view', newView);
        updateUIState();
    });
}

// Color scheme handlers
document.querySelectorAll('.scheme-option').forEach(button => {
    button.addEventListener('click', () => {
        const scheme = button.dataset.scheme;
        document.documentElement.setAttribute('data-color-scheme', scheme);
        localStorage.setItem('colorScheme', scheme);
        showToast(`Color scheme changed to ${scheme}`);
    });
});

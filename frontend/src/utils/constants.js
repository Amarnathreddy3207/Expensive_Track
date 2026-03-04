export const CATEGORIES = [
    'Food & Dining',
    'Transport',
    'Shopping',
    'Bills & Utilities',
    'Entertainment',
    'Health & Medical',
    'Education',
    'Groceries',
    'Subscriptions',
    'Rent & Housing',
    'Other'
];

export const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'Net Banking', 'Wallet'];

export const CATEGORY_EMOJIS = {
    'Food & Dining': '🍽️',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Bills & Utilities': '💡',
    'Entertainment': '🎬',
    'Health & Medical': '🏥',
    'Education': '📚',
    'Groceries': '🛒',
    'Subscriptions': '📱',
    'Rent & Housing': '🏠',
    'Other': '📌'
};

export const CATEGORY_COLORS = {
    'Food & Dining': '#5b9bd5',
    'Transport': '#7ec8a4',
    'Shopping': '#f4a582',
    'Bills & Utilities': '#e07b7b',
    'Entertainment': '#9c8ec1',
    'Health & Medical': '#6dbfb8',
    'Education': '#82b1d4',
    'Groceries': '#a8c97f',
    'Subscriptions': '#d4a574',
    'Rent & Housing': '#8a8cc2',
    'Other': '#9ca3af'
};

export const PAYMENT_EMOJIS = {
    'UPI': '📲',
    'Card': '💳',
    'Cash': '💵',
    'Net Banking': '🏦',
    'Wallet': '👛'
};

export const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

export const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Auto-categorize based on title keywords
export const autoDetectCategory = (title) => {
    const t = title.toLowerCase();
    if (/zomato|swiggy|food|pizza|burger|restaurant|cafe|dining|meal|lunch|dinner|breakfast|coffee|tea/.test(t)) return 'Food & Dining';
    if (/uber|ola|cab|taxi|bus|metro|train|auto|fuel|petrol|diesel|parking/.test(t)) return 'Transport';
    if (/amazon|flipkart|myntra|shopping|clothes|shoes|fashion|mall|store/.test(t)) return 'Shopping';
    if (/electricity|water|gas|internet|wifi|phone|bill|utility|maintenance/.test(t)) return 'Bills & Utilities';
    if (/netflix|prime|hotstar|movie|cinema|game|spotify|music|concert/.test(t)) return 'Entertainment';
    if (/hospital|medicine|doctor|pharmacy|health|medical|gym|fitness/.test(t)) return 'Health & Medical';
    if (/school|college|course|book|tuition|education|fees/.test(t)) return 'Education';
    if (/grocery|vegetables|fruits|milk|bread|supermarket|dmart|bigbasket/.test(t)) return 'Groceries';
    if (/subscription|membership|monthly|annual|plan/.test(t)) return 'Subscriptions';
    if (/rent|housing|apartment|pg|hostel/.test(t)) return 'Rent & Housing';
    return 'Other';
};

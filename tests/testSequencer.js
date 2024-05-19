const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
    sort(tests) {
        const copy = Array.from(tests);
        return [
            copy.find(test => test.path.includes('login_api.test.js')),
            copy.find(test => test.path.includes('user_api.test.js')),
            copy.find(test => test.path.includes('blog_api.test.js')),
            ...copy.filter(test => !test.path.includes('login_api.test.js') && !test.path.includes('user_api.test.js') && !test.path.includes('blog_api.test.js'))      
        ];
    }
}

module.exports = CustomSequencer;
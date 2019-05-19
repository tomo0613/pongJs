const eventSource = new EventSource('sse');

eventSource.onmessage = (e) => {
    console.info('dev-server ', e.data);

    if (e.data === 'reload') {
        document.location.reload();
    }
};

// ToDo fix The connection to http://localhost:3000/sse was interrupted while the page was loading.
window.addEventListener('beforeunload', () => {
    eventSource.close();
});

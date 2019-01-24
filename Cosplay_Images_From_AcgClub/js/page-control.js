let currentPage = 1,
    re = /#.+/;
window.addEventListener("popstate", function(evt) {
    console.log(currentPage);
    console.log(evt.state);
    currentPage = +(evt.state.page) ? +(evt.state.page) : currentPage;
    navigate(location.href, false, currentPage);
})
function navigate(url, isSave, currentPage) {
    let displayUrl = url.replace(re, '');
    $.ajax({
        url: 'https://rabtman.com/api/v2/acgclub/category/cosplay/pictures',
        data: {
            offset: currentPage
        },
        success: function(data) {
            console.log(data);
            $(".main").html('');
            getNewAllImgs(data.data);
            $(".lazy").lazyload();
            $('.grp a').simpleLightbox({
                sourceAttr: $(this).attr('href'),
                navText: ['←','→'],
                closeText: '×',
                docClose: true
            });
            $(".main")[0].scrollIntoView();
        }
    })
    if(isSave) {
        history.pushState({page: currentPage}, null, displayUrl);
    } else {
        history.replaceState({page: currentPage}, null, displayUrl);
    }
}
navigate(location.pathname + '?page=' + currentPage, false, currentPage);
$("#prev").click(function() {
    console.log(currentPage);
    if(currentPage == 1) {
        return false;
    } else {
        currentPage--;
        navigate(location.pathname + '?page=' + currentPage, true, currentPage);
    }
})
$("#next").click(function() {
    currentPage++;
    navigate(location.pathname + '?page=' + currentPage, true, currentPage);
})
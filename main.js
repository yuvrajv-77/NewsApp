$(document).ready(function () {
    // Code to be executed when the DOM is fully loaded
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
    // Function to fetch top headlines
    function fetchTopHeadlines() {
        const url = 'https://real-time-news-data.p.rapidapi.com/top-headlines?limit=500&country=IN&lang=en';
        return $.Deferred(function(deferred) {
            const cacheKey = `news_cache_${url}`;
            const cachedData = localStorage.getItem(cacheKey);
            
            if (cachedData) {
              const { timestamp, data } = JSON.parse(cachedData);
              if (Date.now() - timestamp < CACHE_DURATION) {
                deferred.resolve(data);
                return;
              }
            }
        
            $.ajax({
              url: url,
              method: 'GET',
              headers: {
                        'x-rapidapi-key': '5f82750df5msh6ee50047dce4562p10be4ajsn31cbc2a9bcfb',
                        'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
                    },
              success: function(data) {
                localStorage.setItem(cacheKey, JSON.stringify({
                  timestamp: Date.now(),
                  data: data
                }));
                deferred.resolve(data);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                deferred.reject(errorThrown);
              }
            });
          }).promise();

        // const settings = {
        //     async: true,
        //     crossDomain: true,
        //     url: 'https://real-time-news-data.p.rapidapi.com/top-headlines?limit=500&country=IN&lang=en',
        //     method: 'GET',
        //     headers: {
        //         'x-rapidapi-key': '5f82750df5msh6ee50047dce4562p10be4ajsn31cbc2a9bcfb',
        //         'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
        //     }
        // };
        // return $.ajax(settings);
    }

    // function to create big article for 4 article set
    function createBigArticle(article) {
        return `
            <article class="news-big-left article-hover">
                <img class="news-img" src="${article.photo_url}" alt="${article.title}"/>
                
                <img class="source-logo" src="${article.source_logo_url}" alt="${article.snippet}"/>
                <h3 class="news-title-big u-text">${article.title}</h3>
                <p class="date">${article.published_datetime_utc}</p>
            </article>
        `
    }

    // function to create small article for 4 article set
    function createSmallArticle(article) {
        return `
            <article class="news-small-one article-hover">
                <img class="source-logo" src="${article.source_logo_url}" alt="${article.snippet}"/>
                <h5 class="u-text">${article.title}</h5>
                <p class="date">${article.published_datetime_utc}</p>
            </article>
        `
    }

    // function to create small article for 2 article set
    function createTopArticles(article) {
        return `
            <article class="one-article article-hover">
                <img class="source-logo" src="${article.source_logo_url}" alt="${article.snippet}"/>
                <div class="one-article-head flex">
                  <h3 class="one-article-title u-text">
                   ${article.title}
                  </h3>

                  <img
                    src="${article.photo_url}"
                    alt=""
                  />
                </div>

                <p class="date">${article.published_datetime_utc}</p>
              </article>
        `
    }

    function renderTopHeadlines(headlines) {
        const $topHeadlines = $('#top-headlines');
        const $topHeadlinesTwo = $('#top-headlines-2');
        const $topArticles = $('#top-articles');
        $topHeadlines.empty();

        if (headlines.length > 0) {
            const bigArticle = createBigArticle(headlines[0]);
            const bigArticleTwo = createBigArticle(headlines[5]);
            const smallArticles = headlines.slice(1, 4).map(createSmallArticle).join('<hr />');
            const smallArticlesTwo = headlines.slice(6, 9).map(createSmallArticle).join('<hr />');
            const topArticle = headlines.slice(11, 13).map(createTopArticles).join('<hr />');

            $topHeadlines.html(`
                ${bigArticle}
                <div class="news-small-right only-flex">
                    ${smallArticles}
                </div>
            `);
            $topHeadlinesTwo.html(`
                ${bigArticleTwo}
                <div class="news-small-right only-flex">
                    ${smallArticlesTwo}
                </div>
            `);

            $topArticles.html(topArticle);
        } else {
            $topHeadlines.html('<p>No top headlines available at the moment.</p>');
            $topHeadlinesTwo.html('<p>No top headlines available at the moment.</p>');
        }
    }

    fetchTopHeadlines()
        .done(function (data) {
            console.log(data);

            renderTopHeadlines(data.data);
        })
        .fail(function (error) {
            console.error('Error fetching top headlines:', error);
            $('#top-headlines').html('<p>Failed to load top headlines. Please try again later.</p>');
        });
});

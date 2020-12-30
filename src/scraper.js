const fetch = require('node-fetch');

const cheerio = require('cheerio');

const urls = [
    'https://www.worldometers.info',
    'https://www.worldometers.info/coronavirus/',
    'https://www.worldometers.info/coronavirus/country'
];

const getWorldData = async () => {
    const resp = await fetch(urls[1]);
    const body = await resp.text();

    try{
        const $ = cheerio.load(body);

        const world_data = [];

        const rows = $('#main_table_countries_today tbody tr');

        const props = ['id', 'country', 'cases', 'new_cases', 'deaths', 'new_deaths', 'recovered'];

        rows.each((i, el) => {
            const cols = $(el).find('td');

            const country_data = {};

            cols.each((i, el) => {
                if(i <= props.length - 1)
                    country_data[props[i]] = $(el).text().trim();
            });

            const country_id = $($(cols)[1]).find('a').attr('href');
            
            country_data.country_id = country_id ? country_id.match(/country\/(.*)\//)[1] : '';

            world_data.push(country_data);
        });

        return world_data.slice(8,228);
    }
    catch(error){
        throw new Error(`Scraping error: ${error.message}`);
    }
}

const getCountryData = async (country) => {
    const resp = await fetch(`${urls[2]}/${country}`);
    const body = await resp.text();

    try{
        const $ = cheerio.load(body);

        const country_data = {};

        country_data.name = $($('h1')[0]).text().trim();
        country_data.flag = `${urls[0]}${$($('h1')[0]).find('img').attr('src')}`;
        country_data.cases = $($('.maincounter-number')[0]).find('span').text().trim();
        country_data.deaths = $($('.maincounter-number')[1]).find('span').text().trim();
        country_data.recovered = $($('.maincounter-number')[2]).find('span').text().trim();

        const dates = [];
        $('button.date-btn').each((i, el) => {
            dates.push($(el).text().trim());
        });

        const updates = [];
        $('li.news_li').each((i, el) => {
            updates.push($(el).text().trim().replace(/\s+\[.*\]$/g,''));
        });

        country_data.dates = dates;
        country_data.updates = updates.slice(1);

        country_data.news = Array.from({length:dates.length}, (_,i) => {
            return {
                date:country_data.dates[i],
                update:country_data.updates[i]
            };
        });

        return country_data;
    }
    catch(error){
        throw new Error(`Scraping error: ${error.message}`);
    }
}

module.exports = { getWorldData, getCountryData };
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchDetail() {
    const isbn = '978-616-94337-1-2';
    const url = `https://e-service.nlt.go.th/ISBNReq/ListSearchPub?KeywordTypeKey=4&Keyword=${isbn}&ISBNReqTypeKey=`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const detailLink = $('a.btn.btn-default[href*="Detail"]');

        if (detailLink.length > 0) {
            const detailId = detailLink.attr('href').match(/Detail\/(\d+)/)[1];
            const detailUrl = `https://e-service.nlt.go.th/ISBNReq/Detail/${detailId}`;
            const detailData = await axios.get(detailUrl).then(res => res.data);
            const detail$ = cheerio.load(detailData);

            const titleValue = detail$(process.env.TITLE_XPATH).attr('value') || "";
            const authorValue = detail$(process.env.AUTHOR_XPATH).attr('value') || "";
            const translatorValue = detail$(process.env.TRANSLATOR_XPATH).attr('value') || "";
            const illustratorValue = detail$(process.env.ILLUSTRATOR_XPATH).attr('value') || "";
            const editionValue = detail$(process.env.EDITION_XPATH).attr('value') || "";
            const seriesValue = detail$(process.env.SERIES_XPATH).attr('value') || "";
            const yearValue = detail$(process.env.YEAR_XPATH).attr('value') || "";
            const pageValue = detail$(process.env.PAGE_XPATH).attr('value') || "";
            const publisherValue = detail$(process.env.PUBLISHER_XPATH).attr('value') || "";

            console.log(`Title: ${titleValue}`);
            console.log(`Author: ${authorValue}`);
            console.log(`Translator: ${translatorValue}`);
            console.log(`Illustrator: ${illustratorValue}`);
            console.log(`Edition: ${editionValue}`);
            console.log(`Series: ${seriesValue}`);
            console.log(`Year: ${yearValue}`);
            console.log(`Page: ${pageValue}`);
            console.log(`Publisher: ${publisherValue}`);
        } else {
            console.log('ไม่พบลิงค์สำหรับรายละเอียด');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
    }
}

fetchDetail();
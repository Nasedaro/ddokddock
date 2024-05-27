const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../util/db');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
  const { keyword, sort, page, perPage } = req.query; //페이징처리
  const offset = (page - 1) * perPage;

  let query = `
    SELECT s.study_id, s.title, s.content, m.nickname AS leader_nickname, s.created_at
    FROM study s
    JOIN member m ON s.leader_id = m.member_id
  `;

  if (keyword) {
    query += ` WHERE s.title LIKE '%${keyword}%' OR s.content LIKE '%${keyword}%' `;
  }

  if (sort === 'latest') {
    query += ` ORDER BY s.created_at DESC `;
  } else {
    query += ` ORDER BY s.created_at ASC `;
  }

  query += ` LIMIT ${offset}, ${perPage} `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('검색 중 오류 발생:', error);
      res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
    } else {
      res.json(results);
    }
  });
});



module.exports = router;
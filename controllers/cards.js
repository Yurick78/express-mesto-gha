const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  const likes = [];
  Card.create({
    name,
    link,
    owner,
    likes,
  })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

// Удаление карточки
const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// Добавить лайк
const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true, runValidators: true })
    .orFail(() => res.status(404).send({ message: 'Передан несуществующий _id карточки' }))
    .then((card) => res.send({ card }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

// Удалить лайк
const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true, runValidators: true })
    .orFail(() => res.status(404).send({ message: 'Передан несуществующий _id карточки' }))
    .then((card) => res.send({ card }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};

import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className='button' onClick={onClick}>
      {children}{' '}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);

  function handleShowAddFriend() {
    setShowAddFriend(show => !show);
    // setShowAddFriend(!showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend(crr => (crr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectedFriend={handleSelectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>

      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
    </div>
  );
}

function FriendsList({ friends, onSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelectedFriend={onSelectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectedFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 ? (
        <p className='red'>
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      ) : friend.balance > 0 ? (
        <p className='green'>
          {friend.name} owes you {friend.balance}€
        </p>
      ) : (
        <p>You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelectedFriend(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [addName, setAddName] = useState('');
  const [addImage, setAddImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();

    if (!addName || !addImage) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name: addName,
      image: `${addImage}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
  }

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>👭 Friend name:</label>
      <input
        type='text'
        value={addName}
        onChange={e => setAddName(e.target.value)}
      ></input>
      <label>🌆 Image URL:</label>
      <input
        type='text'
        value={addImage}
        onChange={e => setAddImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const [payer, setPayer] = useState('user');

  return (
    <form className='form-split-bill'>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value:</label>
      <input
        type='text'
        value={bill}
        onChange={e => setBill(Number(e.target.value))}
      />

      <label>👩 Your expense:</label>
      <input
        type='text'
        value={paidByUser}
        onChange={e => setPaidByUser(Number(e.target.value))}
      />

      <label>👩 {selectedFriend.name}'s expense:</label>
      <input type='text' disabled value={bill ? bill - paidByUser : ''} />

      <label>🤑 Who is paying the bill:</label>
      <select value={payer} onChange={e => setPayer(e.target.value)}>
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>
    </form>
  );
}

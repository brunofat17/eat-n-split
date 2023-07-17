import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [selected, setSelected] = useState("");
  const [addFriendName, setAddFriendName] = useState("");
  const [addFriendImage, setAddFriendImage] = useState(
    "https://i.pravatar.cc/48"
  );
  const [friends, setFriends] = useState(initialFriends);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isSplitFormOpen, setIsSplitFormOpen] = useState(false);

  function handleSelectClick(friend) {
    if (friend === selected) {
      setSelected("");
      setIsSplitFormOpen(false);
    } else {
      setSelected(friend);
      setIsSplitFormOpen(true);
    }
  }

  function handleAddFriendFormButton() {
    setIsAddFriendOpen(!isAddFriendOpen);
    setSelected("");
    setIsSplitFormOpen(false);
  }

  function handleAddFriendName(e) {
    setAddFriendName(e.target.value);
  }

  function handleAddFriendImage(e) {
    setAddFriendImage(e.target.value);
  }

  function handleButtonAddClick() {
    setFriends([
      ...friends,
      {
        id: Math.random(),
        name: addFriendName,
        image: addFriendImage,
        balance: 0,
      },
    ]);
    setAddFriendName("");
    setAddFriendImage("https://i.pravatar.cc/48");
    handleAddFriendFormButton();
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selected={selected}
          handleSelectClick={handleSelectClick}
        />
        {isAddFriendOpen ? (
          <>
            <AddFriendForm
              handleAddFriendName={handleAddFriendName}
              addFriendName={addFriendName}
              handleAddFriendImage={handleAddFriendImage}
              addFriendImage={addFriendImage}
              handleButtonAddClick={handleButtonAddClick}
            />
            <button className="button" onClick={handleAddFriendFormButton}>
              Close
            </button>
          </>
        ) : (
          <button className="button" onClick={handleAddFriendFormButton}>
            Add Friend
          </button>
        )}
      </div>
      {isSplitFormOpen ? (
        <BillSplitForm
          isSplitFormOpen={isSplitFormOpen}
          selected={selected}
          friends={friends}
          setFriends={setFriends}
        />
      ) : null}
    </div>
  );
}

function FriendsList({ friends, selected, handleSelectClick }) {
  return friends.map((friend) => (
    <ul>
      <Friends
        selected={selected}
        friend={friend}
        handleSelectClick={handleSelectClick}
      />
    </ul>
  ));
}

function Friends({ selected, friend, handleSelectClick }) {
  return (
    <li className={friend.id === selected ? "selected" : ""}>
      <img src={friend.image} alt={friend.id} />
      <h2> {friend.name} </h2> <br />
      <span
        className={
          friend.balance > 0 ? "red" : friend.balance < 0 ? "green" : ""
        }
      >
        {friend.balance > 0
          ? `${friend.name} owns you ${Math.abs(friend.balance)}`
          : friend.balance < 0
          ? `You owe ${friend.name} ${Math.abs(friend.balance)}`
          : `You and ${friend.name} are even`}
      </span>
      <button className="button" onClick={() => handleSelectClick(friend.id)}>
        {friend.id === selected ? "Close" : "Select"}
      </button>
    </li>
  );
}

function AddFriendForm({
  handleAddFriendName,
  addFriendName,
  handleAddFriendImage,
  addFriendImage,
  handleButtonAddClick,
}) {
  return (
    <div className="form-add-friend">
      <p>
        <h3> Friend Name </h3>
        <input
          type="text"
          value={addFriendName}
          onChange={(e) => handleAddFriendName(e)}
        ></input>
      </p>
      <p>
        <h3>Image URL </h3>
        <input
          type="text"
          value={addFriendImage}
          onChange={(e) => handleAddFriendImage(e)}
        ></input>
      </p>
      <button className="button" onClick={handleButtonAddClick}>
        Add
      </button>
    </div>
  );
}

function BillSplitForm({ selected, friends, setFriends }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("You");

  function handleSplitBillButton(e) {
    const friendsUpdated = [...friends];
    whoIsPaying === "You"
      ? friendsUpdated.map((friend) =>
          friend.id === selected
            ? (friend.balance = friend.balance + (bill - myExpense))
            : friend
        )
      : friendsUpdated.map((friend) =>
          friend.id === selected
            ? (friend.balance = friend.balance - (bill - myExpense))
            : friend
        );
    setFriends(friendsUpdated);
  }

  return (
    <div className="form-split-bill">
      <h1>
        Split a bill with{" "}
        {friends
          .filter((friend) => friend.id === selected)
          .map((friend) => friend.name)}
      </h1>
      <p>
        Bill Value
        <input
          type="text"
          value={bill}
          onChange={(e) =>
            e.target.value >= 0 ? setBill(e.target.value) : null
          }
        />
      </p>
      <p>
        Your expense
        <input
          type="text"
          value={myExpense}
          onChange={(e) =>
            e.target.value >= 0 ? setMyExpense(e.target.value) : null
          }
        />
      </p>
      <p>
        Friend expense
        <input type="text" value={bill - myExpense}></input>
      </p>
      <p>
        Who's paying the bill
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="You">You</option>
          <option value="Friend">Friend</option>
        </select>
      </p>
      <p>
        <button className="button" onClick={handleSplitBillButton}>
          Split Bill
        </button>
      </p>
    </div>
  );
}

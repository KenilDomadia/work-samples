export async function getAllFiatTransactionsOfUser(user, {
  type,
  status
}) {
  let searchQuery = {
    $or: [{
      senderId: user._id
    }, {

    }]
  };
}

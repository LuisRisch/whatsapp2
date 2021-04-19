export function getRecipientEmail(usersEmail, currUserEMail) {  
  return usersEmail?.filter((userToFilter) => userToFilter !== currUserEMail)[0]
}
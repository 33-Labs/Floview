import "FlowviewAccountBookmark"

transaction(address: Address) {
  let bookmarkCollection: auth(FlowviewAccountBookmark.Manage) &FlowviewAccountBookmark.AccountBookmarkCollection

  prepare(signer: auth(Storage, Capabilities) &Account) {
    if signer.storage.borrow<&FlowviewAccountBookmark.AccountBookmarkCollection>(from: FlowviewAccountBookmark.AccountBookmarkCollectionStoragePath) == nil {
      let collection <- FlowviewAccountBookmark.createEmptyCollection()
      signer.storage.save(<-collection, to: FlowviewAccountBookmark.AccountBookmarkCollectionStoragePath)
      
      let cap = signer.capabilities.storage.issue<&FlowviewAccountBookmark.AccountBookmarkCollection>(FlowviewAccountBookmark.AccountBookmarkCollectionStoragePath)
      signer.capabilities.publish(cap, at: FlowviewAccountBookmark.AccountBookmarkCollectionPublicPath)
    }

    self.bookmarkCollection = signer.storage
      .borrow<auth(FlowviewAccountBookmark.Manage) &FlowviewAccountBookmark.AccountBookmarkCollection>(from: FlowviewAccountBookmark.AccountBookmarkCollectionStoragePath)
      ?? panic("Could not borrow collection")
  }

  execute {
    self.bookmarkCollection.removeAccountBookmark(address: address)
  }
}
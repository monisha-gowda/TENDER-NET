# TENDER-NET

This blockchain project has been built on Hyperledger Composer. Its functionalities include the following.

1. Reverse auction is conducted for tenders of Government projects in a secure, fast and fair     
    manner.  
2.Once the auction gets over, the contract is monitored until the project gets over and   
    Stakeholders (the winning contractor being one) of the project are consulted for checking the
    genuinity of each transaction of the contract.
     
It has been implemented in the following parts.

Bidding:
This business network defines:

Participants:
  Member
  Auctioneer

Assets:
  Tender
  TenderListing

Transactions:
  Offer
  CloseBidding

The makeOffer function is called when an Offer transaction is submitted. The logic simply checks that the listing for the offer is still for sale, and then adds the offer to the listing, and then updates the offers in the TenderListing asset registry.

The closeBidding function is called when a CloseBidding transaction is submitted for processing. The logic checks that the listing is up for auction, sorts the offers by bid price, and then if the reserve has been met, transfers the ownership of the contract associated with the listing to the best bidder. All the modified assets are updated in their respective registries.

----------------------------------------------------------------------------------------------------------------------------

Monitoring:
This business network defines:

Participants:
  Contractor
  Department
  Engineer
  Supplier
  Public Representative
  Labour Union Representative

Assets:
  Contract
  Document
  EngineerValidationData
  SupplierValidationData
  LabourRepValidationData


Transactions:
  CloseContract
  Engineer_Validate
  Supplier_Validate
  LabourRep_Validate
  SubmitDocument

The submitDocument function is called when a SubmitDocument  transaction is submitted. The logic simply checks if the state of the contract is open, adds a document to the contract, and then updates the documents in the Contract asset registry.

The engineerValidate function is called when a Engineer_Validate transaction is submitted. This logic creates an array to store the validation statuses of the documents according to the Engineer if the array doesn’t already exist. It then checks if any of the documents have received a negative validation (‘0’ value) instead of a positive validation (‘1’ value). If so it changes the engineerValidationStatus of the Contract to ‘Not Validated’ and throws an error asking for a revalidation. If not it changes it to ‘Validated’. It then updates the Contract asset registry.

The labourRepValidate function is called when a LabourRep_Validate transaction is submitted. This logic creates an array to store the validation statuses of the documents according to the Labour Repsesentative if the array doesn’t already exist. It then checks if any of the documents have received a negative validation (‘0’ value) instead of a positive validation (‘1’ value). If so it changes the labourRepValidationStatus of the Contract to ‘Not Validated’ and throws an error asking for a revalidation. If not it changes it to ‘Validated’. It then updates the Contract asset registry.

The supplierValidate function is called when a Supplier_Validate transaction is submitted. This logic creates an array to store the validation statuses of the documents according to the Raw Material Supplier if the array doesn’t already exist. It then checks if any of the documents have received a negative validation (‘0’ value) instead of a positive validation (‘1’ value). If so it changes the supplierValidationStatus of the Contract to ‘Not Validated’ and throws an error asking for a revalidation. If not it changes it to ‘Validated’. It then updates the Contract asset registry.

The closeContract function is called when a CloseContract transaction is submitted for processing. The logic checks if the state of the contract is ‘OPEN’ and then changes the state to ‘CLOSED’ making it impossible to submit any more documents to the contract. It then updates the Contract asset registry.

----------------------------------------------------------------------------------------------------------------------------

Scalability and Future improvements : 

1. Multiorganization Peers and Endorsers.
2. For now, the best bid is the lowest bid. But the system can be scaled to include a grading   
    system to determine the winning contractor based on their previous performances in addition to 
    the auction process. 
3. The system can be improved to return a comprehensive bill of all the expenses incurred
    throughout the project 
4. Managing contractor compliance with blockchain could allow the government to maintain a 
    real-time compliance dashboard, indicating to what degree each of their contractors  is 
    compliant with a project’s requirements as deadlines approach. 
5. The project can be scaled to include a feedback portal for the public outside the blockchain 
    network to voice their complaints and suggestions. 



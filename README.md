1st observation of this workshop is node honest.js

Results.....of  Honest Consensus

====================

Proposal: 100

====================

A voted 100

B voted 100

C voted 100

D voted 100



Vote Tally

┌─────────┬────────┐

│ (index) │ Values │

├─────────┼────────┤

│ 100     │ 4      │

└─────────┴────────┘

Required Quorum = 3



COMMITTED: 100

All four validators A, B, C and D voted for value 100. The total number of votes was 4, and the required quorum was 3. The final result was COMMITTED: 100.

2nd observation of the workshop is Byzantine Behaviour node byzantine.js

Results....



====================

Proposal: 100

====================

A voted 100

B voted 100

C voted 100

D voted 50



Vote Tally

┌─────────┬────────┐

│ (index) │ Values │

├─────────┼────────┤

│ 50      │ 1      │

│ 100     │ 3      │

└─────────┴────────┘

Required Quorum = 3



COMMITTED: 100

Validators A, B and C voted for 100, but validator D voted for 50. The value 100 received 3 votes, while 50 received only 1 vote. The result was COMMITTED: 100.



3rd observation of workshop is Equivocation node equivocation.js

{

&#x20; nodeId: 'D',

&#x20; value: 100,

&#x20; signature: 'fc9daaeaf50cc2daf1b9a23cef673a4d7e0b56e25422ce147744738fa75e8017'

}

{

&#x20; nodeId: 'D',

&#x20; value: 50,

&#x20; signature: '95298f81a6212895a9b19fc91bdb63b34aea36c813cb5ff8033c0d9f8680872e'

}

{

&#x20; nodeId: 'D',

&#x20; value: 75,

&#x20; signature: '464c60f5969fc779697d7c23bbfc9493bb0b6f1705dd592d02a0de2e22abefbb'

}

&#x20;Validator D sent three messages with the values 100, 50 and 75. Each message had a different signature.

4th observation is Key Theft node key\_theft.js

Forged message

{

&#x20; nodeId: 'A',

&#x20; value: 999,

&#x20; signature: '669dd5970bf6d1d8ac7b2aaffbfd9d7159f19aeae7c3c45a6dd50bc1867161d0'

}

The program displayed a forged message claiming to be from validator A. The message contained the value 999 and a signature.

5th Is observation is Sybil Attack node sybil.js

Original validator set

┌─────────┬────────┐

│ (index) │ Values │

├─────────┼────────┤

│ 0       │ 'A'    │

│ 1       │ 'B'    │

│ 2       │ 'C'    │

│ 3       │ 'D'    │

└─────────┴────────┘

After Sybil attack

┌─────────┬────────┐

│ (index) │ Values │

├─────────┼────────┤

│ 0       │ 'A'    │

│ 1       │ 'B'    │

│ 2       │ 'C'    │

│ 3       │ 'D'    │

│ 4       │ 'X1'   │

│ 5       │ 'X2'   │

│ 6       │ 'X3'   │

│ 7       │ 'X4'   │

└─────────┴────────┘

The original validator set had four validators: A, B, C and D. After the attack, four more identities, X1, X2, X3 and X4, were added.

6th observation is Quorum Tampering node quorum\_tampering.js



====================

Proposal: 100

====================

A voted 100

B voted 100

C voted 50

D voted 50



Vote Tally

┌─────────┬────────┐

│ (index) │ Values │

├─────────┼────────┤

│ 50      │ 2      │

│ 100     │ 2      │

└─────────┴────────┘

Required Quorum = 2



SAFETY VIOLATION!

Multiple values reached quorum:

┌─────────┬───────┬───────┐

│ (index) │ value │ votes │

├─────────┼───────┼───────┤

│ 0       │ '50'  │ 2     │

│ 1       │ '100' │ 2     │

└─────────┴───────┴───────┘

Validators A and B voted for 100, while C and D voted for 50. Both values received 2 votes, and the required quorum was set to 2. The program displayed SAFETY VIOLATION!

the 7th observation is Breaking BFT  node quorum\_tampering.js



====================

Proposal: 100

====================

A voted 100

B voted 100

C voted 50

D voted 50



Vote Tally

┌─────────┬────────┐

│ (index) │ Values │

├─────────┼────────┤

│ 50      │ 2      │

│ 100     │ 2      │

└─────────┴────────┘

Required Quorum = 2



SAFETY VIOLATION!

Multiple values reached quorum:

┌─────────┬───────┬───────┐

│ (index) │ value │ votes │

├─────────┼───────┼───────┤

│ 0       │ '50'  │ 2     │

│ 1       │ '100' │ 2     │

└─────────┴───────┴───────┘

The quorum was set too low, allowing two different values to reach quorum and causing a safety violation.

8th observation is Hardening the BFT System

Make sure Node.js is installed.



Make sure Node.js is installed and open a terminal in the project folder.



Run the scenarios using:



node scenarios/honest.js

node scenarios/byzantine.js

node scenarios/equivocation.js

node scenarios/key\_theft.js

node scenarios/sybil.js

node scenarios/quorum\_tampering.js

node scenarios/admission\_control.js

node scenarios/certificate\_validation.js



What I Learned



I learned that BFT systems should not blindly trust individual nodes. They need valid evidence, secure validator membership and correct quorum rules. I also learned that attacks can affect consensus when security assumptions are broken, and that extra checks can help detect or reduce these attacks.



Limitations



This is an educational simulator, not a production security system. Its cryptographic code is simplified and should not be used to protect real systems.


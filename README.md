## Script Inject Unlock
Hello!   

This project consists of several things:
* A fake Lightspeed Relay block screen
* An iframe to that block screen on ``index.html``
* A function with a password
* A requirement of the script to be ran to remove the iframe and/or unlock the webpage

In order to change the password, you can go to ``index.html`` line 20 and change the string to suit your own needs   

If you would also like to change the appearance of the block screen, you may edit the code in ``blocked.html``. Useful places:
* School District Name: ``Line 324``
* Block Reason: ``Line 332``

In order to unlock the webpage/remove the iframe, you must run ``unlock("key")`` but replace "key" with whatever password you set in quotes   

If you can't access the dev console to run the code I would suggest using a script injector to run it instead, as it has the exact same result.     

If you would like to suggest anything or change something, feel free to DM me on discord @ FireStreaker2#0001 or open a pull request.    

Also feel free to star this repository!    

Extra Note: The IP Address displayed is a random IP, the code does not have an IP Logger.     

Extra Disclaimer: I am not in any way responsible for your actions
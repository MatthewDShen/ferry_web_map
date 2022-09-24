# Ferry Map Timeline
The objective of this project is to simulate the New York City MTA Ferry system over a day`.

The project was created by Matthew Shen

The following map was generated as a Project for INFO 5410. More information on the class can be found [here](https://classes.cornell.edu/browse/roster/FA20/class/INFO/5410).

## The hard system
The hard system that is being studied in this project is the New York City ferry system. We are specifically looking at the system in New York City that is operated by Hornblower Cruises.

### Network
At the most microscopic level the network of the NYC ferry system is the paths that each ferry route takes; however, when you zoom out and take a more macroscopic approach we can see that given routes are simply suggestions of how the system is expected to act. Fundamentally the true network of the ferry system is the waterways of New York City. These waterways act as the biggest limitation on the network.

### Nodes
The nodes of the system that interact with the rest of the New York City transit system are the ferry stations. These points act as the interface between the ferry system and the rest of New York City as well. In addition to these interface nodes there are network nodes. These network nodes act as guiding points along different routes. This ensures that the ferries take both a safe and efficient route.

### Agents
The agents in the system can use and help maintain the ferries. This mostly includes the passengers which move through the system. The other prevalent agents are the ferries which are agents that stay within the system. A more sublet agent of the system are the employees which ensure that the system operates smoothly.

### Flows
The most quantifiable flow within the system are the movements of the ferries. Whilst the ships move throughout the system they represent a vehicle per unit of time. Additional flows can be seen in the passenger movements and even the tides of the east river.

## Defining the agents
The two major agents of the system are the ferries and passengers. The ferries have more quantifiable attributes. These attributes have a direct impact on the ferry's operations. Attributes include the capacity(350 passengers), the top speed(29 mph), and range. The passengers on the ferry network are much more complex. Their attributes are usually tied to passenger demand. This includes the passengers requested destination, their last mile preferences, the passengers income, how they value comfortability, and how the value wait time. In this system each passenger has unique attributes that ultimately affect whether they use the ferry and how they use the system.

## The interactive map that is part of this project can be found [here](https://matthewdshen.github.io/ferry_web_map/). The map allows you to scroll through a typical week day for the NYC ferry system. The data was provided by Hornblower Cruises and can be found [here](http://nycferry.connexionz.net/rtt/public/utility/gtfs.aspx).

## Network & flow analysis
The network and flows of this particular hard system are heavily integrated. Specifically the flow of the passenger demand dictates the shape of the network, and vice versa the network restricts where the passenger flows can go. This tightly woven relationship is also seen in the connections of the network and the nodes. The links within the network must travel over water and as a result it forces the nodes along the shoreline in New York City.

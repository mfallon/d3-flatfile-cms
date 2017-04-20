/**
 * represent our files in a heirarchical manner
 */
export default class Tree {
  constructor(data) {
    this.rootNode = new Node(data);
    this.json = {};
  }

  // create leaf node at specified address
  add(addr, data) {
    (function recurse(currNode, currAddr) {
      if (currAddr.length) {
        // pluck a member off the beginning of address
        const currLevel = parseInt(currAddr.shift(), 10);
        // if we've reached the leaf, use data
        const nextNode = !currAddr.length ? new Node(data) : new Node({});
        // add in and next
        return recurse(currNode.addChild(nextNode, currLevel), currAddr);
      } else {
        // get back
        return currNode;
      }
    })(this.rootNode, addr.slice());
  }

  toJSON() {
    const { data, children } = this.rootNode;
    const { name } = data;
    this.json = {
      name,
      props: data
    };
    if (children.length) {
      this.json.children = (function recurse(kids) {
        return kids.map(kid => {
          const { data } = kid;
          const { name } = data;
          if (kid.hasChildren()) {
            return {
              name,
              props: data,
              children: recurse(kid.children)
            }
          } else {
            return {
              name,
              props: data
            };
          }
        });
      })(children);
    }
    return this.json;
  }
}


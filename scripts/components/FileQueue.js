/**
 * Queue implementation which will notify when all promises are resolved
 */
class FileQueue {
  constructor() {
    this.fs = require('fs');
    this.tasks = [];
  }
  readFile(file, callback) {
    this.tasks.push(
      new Promise((resolve, reject) => {
        try {
          this.fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        } catch (err) {
          reject(err);
        }
      })
      .then(data => {
        return callback(data);
      }, err => {
        // TODO: test the error
        utils.print(`Error reading file ${ file }: ${ e }`, 'error');
        return null;
      })
    );
  }
  checkResolved() {
    return Promise.all(this.tasks);
  }
}


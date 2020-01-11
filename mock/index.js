/**
 * Mock script
 * @author gongph<youremail.com>
 */

window.MockServer = {
  getProvinces: function() {
    return {
      code: 1,
      message: 'success',
      status: 200,
      data: {
        provinces: [
          { id: 10001, name: '北京' }
        ]
      }
    }
  }
}

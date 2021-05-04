<template>
  <div class="body_box">
    <div class="main_box">
      <div class="avater_box">
        <img src="./../assets/Luffy.jpg" alt="">
      </div>
      <div class="form">
        <a-form layout="vertical" :form="form" @submit="handleSubmit">
          <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
            <a-input
              v-decorator="[
                'userName',
                { rules: [{ required: true, message: '请输入登录账号' }] },
              ]"
              placeholder="账号"
            >
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
            <a-input
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '请输入密码' }] },
              ]"
              type="password"
              placeholder="Password"
            >
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError())">
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
export default {
  data () {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: 'horizontal_login' })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.form.validateFields()
    })
  },
  methods: {
    userNameError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('userName') && getFieldError('userName')
    },
    passwordError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('password') && getFieldError('password')
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          var user = {
            username: values.userName,
            password: values.password
          }
          this.checkLogin(user)
        }
      })
    },
    async checkLogin (values) {
      const res = await this.$http.post('http://localhost:8888/bms/User?action=Login', this.$qs.stringify(values))
      if (res.data.code === 200) {
        this.$message.success('登录成功', 1.5)
        this.$router.push('/home')
      } else {
        this.$message.error(res.data.msg, 1.5)
      }
    }
  }
}
</script>

<style scoped>
.main_box{
  width: 450px;
  height: 300px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 3px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px rgb(156, 156, 156);
  border:1 rgb(85, 85, 85) solid;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.form{
  width: 350px;
  height: 130px;
  background-color: rgba(255,255,255,0.2);
}
.avater_box {
  width: 160px;
  height: 160px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px rgb(156, 156, 156);
  position: absolute;
  left: 50%;
  top: -5%;
  transform: translate(-50%, -50%);
  background-color: rgba(255,255,255,0.2);
}
.avater_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
</style>

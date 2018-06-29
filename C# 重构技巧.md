# 反向判断

之前：

```c#
if (true1) {
    do1;
    if (true2) {
        do2;
        if (true3) {
            do3;
        }
    }
}
```

之后：

```c#
if (!true1) return;
do1;
if (!true2) return;
do2;
if (!true3) return;
do3;
```







# 方法提炼

之前：

``` c#
        public bool Connect()
        {
            return this.IsConnected = (this.Port = InitCommExt()) > 0;
        }

        public bool Connect(int port)
        {
            return this.IsConnected = (this.Port = InitComm(port)) > 0;
        }
```

之后:

```c#
        bool TryConnect(Func<int> action)
        {
            try
            {
                return this.IsConnected = (this.Port = action()) > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool Connect()
        {
            return this.TryConnect(InitCommExt);
        }

        public bool Connect(int port)
        {
            return this.TryConnect(() => InitComm(port));
        }
```


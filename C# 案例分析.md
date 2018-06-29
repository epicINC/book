# 案例 1

之前：

```c#
public FaceDetectResult FaceDetect(string ExhID,string ImageFile)
{
    string strRet="";
    FaceDetectResult objFac = new FaceDetectResult();
    try
    {
        Hashtable ht = new Hashtable();
        ht.Add("ExhID", ExhID);
        strRet = HttpUploadFile(mServerUrl + "/api/Face/FaceDetect", ImageFile, ht);
        objFac = JsonHelper.DeserializeJsonToObject<FaceDetectResult>(strRet);
    }
    catch (Exception ex)
    {
        objFac.status = "ERROR";
        if (strRet == "")
        {
            objFac.ErrorMsg = ex.Message;
        }
        else
        {
            objFac.ErrorMsg = strRet;
        }
    }
    return objFac;
}
```



- 状态 用枚举表示
- 避免无意义的初始化
- 参数合法性检查
- 变量命名
- 只放必要的代码在 try catch 中
- 使用泛型
- 使用初始化器
- 多用 var

改造后：

```c#
public FaceDetectResult Detect(string exhID, string imageFile)
{
    string result = null;
    var parameters = new Dictionary<string, string>()
    {
        { "ExhID",  exhID}
    };

    try
    {

        result = HttpUploadFile(ServerUrl + "/api/Face/FaceDetect", imageFile, parameters);
        if (String.IsNullOrWhiteSpace(result)) return FaceDetectResult.RequestFail();
        return JsonHelper.DeserializeJsonToObject<FaceDetectResult>(result);
    }
    catch (Exception ex)
    {
        return FaceDetectResult.Fail(result ?? ex.Message);
    }
}


public enum FaceDetectResultType
{
    Success,
    Error
}

public static FaceDetectResult Fail(string value)
{
    return new FaceDetectResult()
    {
        Status = FaceDetectResultType.Error,
        ErrorMsg = value
    };
}

public static FaceDetectResult RequestFail()
{
    return Fail("Request Fail.");
}

```



# 案例 2

之前：52

```c#

private string HttpUploadFile(string url, string file, Hashtable htPara)
{
    try
    {
        Uri server = new Uri(url);
        HttpClient httpClient = new HttpClient();

        //这里会向服务器上传一个png图片和一个txt文件
        MultipartFormDataContent multipartFormDataContent = new MultipartFormDataContent();
        FileStream fs = null;
        if (file != "")
        {
            fs = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.Read);
            StreamContent streamConent = new StreamContent(fs);
            if (file.ToLower().StartsWith("http://"))//是URL地址，直接传URL
            {
                htPara.Add("ImageFile", file);
            }
            else
            {
                string strFileName = file.Substring(file.LastIndexOf('/') + 1);
                multipartFormDataContent.Add(streamConent, strFileName, strFileName);
            }
           
        }
        //添加参数
        foreach (DictionaryEntry de in htPara)
        {
            ByteArrayContent bacTmp = new ByteArrayContent(Encoding.UTF8.GetBytes(de.Value.ToString()));
            multipartFormDataContent.Add(bacTmp, de.Key.ToString());
        }

        HttpResponseMessage responseMessage = httpClient.PostAsync(server, multipartFormDataContent).Result;
        if(fs!=null)
        {
            fs.Close();
            fs.Dispose();
            fs = null;
        }
        if (responseMessage.IsSuccessStatusCode)
        {
            string strCC = responseMessage.Content.ReadAsStringAsync().Result;
            return strCC;
        }
        return responseMessage.ToString();
    }
    catch (Exception ex)
    {

        return ex.Message;
    }
}
```

分析函数做的事情

- 参数初始化
- MultipartFormDataContent 初始化
- HTTP 提交

第一阶段：

```c#
string HttpUploadFile(string url, string file, Dictionary<string, string> parameters)
{
    var httpClient = new HttpClient();

    var multipartFormDataContent = new MultipartFormDataContent();
    FileStream fs = null;
    if (!String.IsNullOrWhiteSpace(file))
    {
        if (file.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || file.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            parameters.Add("ImageFile", file);
        else
        {
            if (File.Exists(file))
            {
                var fileName = Path.GetFileName(file);
                fs = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.Read);
                multipartFormDataContent.Add(new StreamContent(fs), fileName, fileName);
            }
        }
    }

    foreach (var item in parameters)
        multipartFormDataContent.Add(new StringContent(item.Value), item.Key);

    try
    {
        var responseMessage = httpClient.PostAsync(url, multipartFormDataContent).Result;

        return responseMessage.IsSuccessStatusCode ? responseMessage.Content.ReadAsStringAsync().Result : null;
    }
    catch (Exception)
    {
        return null;
    }
    finally
    {
        if (fs != null)
        {
            fs.Close();
            fs.Dispose();
        }
    }
}
```

第二阶段：

```c#
HttpContent ParseContent(Dictionary<string, string> parameters, Stream stream = null)
{
    if (stream == null)
        return new FormUrlEncodedContent(parameters);

    var result = new MultipartFormDataContent();
    foreach (var item in parameters)
        result.Add(new StringContent(item.Value), item.Key);

    result.Add(new StreamContent(stream));
    return result;
}

string HttpUploadFile(string url, HttpContent content)
{
    using (var httpClient = new HttpClient())
    {
        try
        {
            var responseMessage = httpClient.PostAsync(url, content).Result;
            return responseMessage.IsSuccessStatusCode ? responseMessage.Content.ReadAsStringAsync().Result : null;
        }
        catch (Exception)
        {
            return null;
        }
    }
}

string HttpUploadFile(string url, string file, Dictionary<string, string> parameters)
{
    if (!String.IsNullOrWhiteSpace(file))
    {
        if (file.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || file.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            parameters.Add("ImageFile", file);
        else
        {
            if (File.Exists(file))
            {
                using (var fs = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    return HttpUploadFile(url, ParseContent(parameters, fs));
                }

            }
        }
    }

    return HttpUploadFile(url, ParseContent(parameters));
}
```



# 案例 3

之前：

```c#
static string[] ArrDict = { "F", "A", "I", "R", "1", "6", "Z", "H", "a", "N" };
public static long NumberDecode(string strSource)
{
    string sTmp = "";
    int j = 0;
    for (int i = 0; i < strSource.Length; i++)
    {
        for (j = 0; j < ArrDict.Length; j++)
        {
            if (ArrDict[j] == strSource.Substring(i, 1))
            {
                sTmp = sTmp + j.ToString();
                break;
            }
        }
        if (j == ArrDict.Length) return 0;//存在不合法字符，返回0
    }
    long lSource = Int32.Parse(sTmp) - 8137;
    //不合法的数字
    if (lSource < 1) return 0;
    if (lSource % 1376 != 0) return 0;   //不全法的数字，返回0
    long lRet = lSource / 1376;
    return lRet;
}
```

之后：

```c#
static readonly IDictionary<char, int> EncodeChars = new Dictionary<char, int>()
{
    { 'F', 0},
    { 'A', 1},
    { 'I', 2},
    { 'R', 3},
    { '1', 4},
    { '6', 5},
    { 'Z', 6},
    { 'H', 7},
    { 'a', 8},
    { 'N', 9},
};

public static int NumberDecode(string value)
{
    int index;
    string data = String.Empty;
    for(var i = 0; i < value.Length; i++)
    {
        if (!EncodeChars.TryGetValue(value[i], out index)) return 0;
        data += index;
    }
    var result = Int32.Parse(data) - 8137;
    if (result < 1) return 0;
    if (result % 1376 != 0) return 0;
    return result / 1376;
}
```


;(function(global) {

    function myPage(el, options) {
        this.el = typeof el === "string" ? document.querySelector(el) : el;
        var default_options = {
            total: 1876,   // 数据总条数
            pageSize: 10,   // 每页默认显示数量
            pageNum: 1,   // 初始化页码
            count: 7,   // 显示按钮个数
            inputJumpPage: true,  // 是否开启输入框跳转页面
            selectPageSize: true,  // 是否开启选择每页显示数据量
            changePage: function(pageNum) {

            },
            changePageSize: function(pageSize) {

            }
        }
        if (options) {
            for (let prop in options) {
                default_options[prop] = options[prop];
            }
        }
        this.options = default_options;
        if (this.options.count < 5) {
            throw new Error('显示按钮个数必须大于等于5')
        }
        this.currentPage = default_options.pageNum;
        this.totals = Math.ceil(parseInt(this.options.total) / parseInt(this.options.pageSize));   // 上取整，根据总数据量和每页显示数据量计算出总页数
        this.init();    // 初始化分页器
    }

    myPage.prototype = {
        init: function() {
            this.destroy();            
            this.renderPage(this.currentPage);
        },
        prevPage: function() {
            // 点击上翻一页
            this.currentPage --;
            this.renderPage(this.currentPage);
            this.options.changePage(this.currentPage);
        },
        nextPage: function() {
            // 点击下翻一页触发
            this.currentPage ++;
            this.renderPage(this.currentPage);
            this.options.changePage(this.currentPage);
        },
        prevJumpPage: function() {
            // 点击上翻几页
            var JumpPage = this.options.count - 2;
            this.currentPage -= JumpPage;
            this.renderPage(this.currentPage);
            this.options.changePage(this.currentPage);
        },
        nextJumpPage: function() {
            // 点击下翻几页
            var JumpPage = this.options.count - 2;
            this.currentPage += JumpPage;
            this.renderPage(this.currentPage);
            this.options.changePage(this.currentPage);
        },
        clickInputJump: function(el) {
            var _this = this;
            el.addEventListener('click',function() {
                _this.currentPage = Number(_this.el.querySelector('.page_input').value);
                _this.renderPage(_this.currentPage);
            })
        },
        selectChangeSize: function(el) {
            var _this = this;
            el.addEventListener('change',function(e) {
                _this.options.pageSize = Number(el.value);
                _this.totals = Math.ceil(parseInt(_this.options.total) / parseInt(_this.options.pageSize));
                console.log(_this.totals);
                _this.renderPage(_this.currentPage);
                _this.options.changePageSize( _this.options.pageSize);
            })
        },
        bindJumpPageMoreShow: function (el,direction) {
            var text = '>>';
            if (direction == 'prev') {
                text = '<<';
            }
            el.addEventListener('mouseenter',function(e) {
                e.target.innerText = text;
            })
            el.addEventListener('mouseleave',function(e) {
                e.target.innerText = '•••';
            })
        },
        bindClickPage: function() {
            // 点击页数按钮触发
            var _this = this;
            var ul = this.el.getElementsByTagName("ul")[0];
            var lis = ul.querySelectorAll("li");
            for (var i = 0;i < lis.length;i ++) {
                if (lis[i].className.indexOf('prev-page') !== -1 || lis[i].className.indexOf('next-page') !== -1 ||  lis[i].className.indexOf('ellipsis') !== -1 ||
                 lis[i].className.indexOf('page-to') !== -1 || lis[i].className.indexOf('select-pagesize') !== -1) {
                }else {
                    (function(i) {
                        _this.addEvent(lis[i],'click',function(e) {
                            // console.log(e.target.innerText);
                            _this.currentPage = Number(e.target.innerText);
                            _this.renderPage(_this.currentPage);
                            _this.options.changePage(_this.currentPage);
                        })
                    }(i))
                }
            }
            
        },
        disablePreNext: function() {
            // 判断是否是第一页或者是最后一页，如果是则给上一页/下一页按钮加上禁用
            if (this.totals && this.options.count) {
                var prev = this.el.querySelector(".prev-page");
                var next = this.el.querySelector('.next-page');
                if (this.currentPage == 1) {
                    prev.style.cssText = "cursor: not-allowed;color: #666666;color: #dcdcdc;background-color: #fafafa;";
                    prev.setAttribute("disabled", true);
                }else {
                    prev.removeAttribute("style");
                    prev.removeAttribute("disabled");
                }
                if (this.currentPage == this.totals) {
                    next.style.cssText = "cursor: not-allowed;color: #666666;color: #dcdcdc;background-color: #fafafa;";
                    next.setAttribute("disabled", true);
                }else {
                    next.removeAttribute("style");
                    next.removeAttribute("disabled");
                }
            }
        },
        renderInputJump: function() {
            var inputJump = `<li class="page-to">跳至<input type="text" class="page_input" />页<span class="go">GO</span></li>`;
            return inputJump;
        },
        renderPageSize: function() {
            var pageSize = `<li class="select-pagesize">
                <select class="select-size">
                    <option value="10">10条/页</option>
                    <option value="20">20条/页</option>
                    <option value="50">50条/页</option>
                    <option value="100">100条/页</option>
                </select>
            </li>`;
            return pageSize;
        },
        renderPage: function(currentPage) {
            // 渲染分页
            var _this = this;
            var prevHtml = `<li class="prev-page"><a>上一页</a></li>`;
            var nextHtml = `<li class="next-page"><a>下一页</a></li>`;
 
            var totals = this.totals,
            counts = Number(this.options.count),
            halfPagerCount = Math.floor((counts - 2) / 2),
            firstPageHtml = "",
            lastPageHtml = "",
            showPagesHtml = "",
            showInputJump = "",
            showSelectSize = "";
            if (this.options.inputJumpPage) {
                showInputJump = this.renderInputJump();
            }

            if (this.options.selectPageSize) {
                showSelectSize = this.renderPageSize();
            }
           
            
            if (totals) {
                firstPageHtml = `<li><a>1</a></li>`;
                if (currentPage === 1) {
                    firstPageHtml = `<li class="current-page"><a>1</a></li>`;
                }
                if (totals > 1) {
                    lastPageHtml = `<li><a>${totals}</a></li>`;
                    if (currentPage >= totals) {
                        this.currentPage = totals;
                        lastPageHtml = `<li class="current-page"><a>${totals}</a></li>`;
                    }
                }
                if (totals > counts) {
                    if (currentPage <= Math.ceil(counts / 2)) {
                        for (var i = 2;i < counts;i ++) {
                            if (i === currentPage) {
                                showPagesHtml += `<li class="current-page"><a>${i}</a></li>`;
                            }else {
                                showPagesHtml += `<li><a>${i}</a></li>`;
                            }
                        }
                        showPagesHtml += `<li class="ellipsis pageJumpNext" title="向后${counts - 2}页">•••</li>${lastPageHtml}`;
                    }else {
                        if (currentPage > totals - Math.ceil(counts / 2)) {
                            for (var i = totals - (counts - 2);i < totals;i ++) {
                                if (i === currentPage) {
                                    showPagesHtml += `<li class="current-page"><a>${i}</a></li>`;
                                }else {
                                    showPagesHtml += `<li><a>${i}</a></li>`;
                                }
                            }
                            showPagesHtml = `<li class="ellipsis pageJumpPrev" title="向前${counts - 2}页">•••</li>${showPagesHtml}${lastPageHtml}`;
                        }else {
                            for (var i = currentPage - halfPagerCount;i <= currentPage + halfPagerCount;i ++) {
                                if (i === currentPage) {
                                    showPagesHtml += `<li class="current-page"><a>${i}</a></li>`;
                                }else {
                                    showPagesHtml += `<li><a>${i}</a></li>`;
                                }
                            }
                            showPagesHtml = `<li class="ellipsis pageJumpPrev" title="向前${counts - 2}页">•••</li>${showPagesHtml}<li class="ellipsis pageJumpNext" title="向后${counts - 2}页">•••</li>${lastPageHtml}`;
                        }
                    }
                }else {
                    for (var i = 2;i < totals;i ++) {
                        if (i === currentPage) {
                            showPagesHtml += `<li class="current-page"><a>${i}</a></li>`;
                        }else {
                            showPagesHtml += `<li><a>${i}</a></li>`;
                        }
                    }
                    showPagesHtml += lastPageHtml;
                }

                var customPaginationHtml = "";
                if (totals && counts) {
                    customPaginationHtml = `<ul class="pageWrap">${prevHtml}${firstPageHtml}${showPagesHtml}${nextHtml}${showSelectSize}${showInputJump}</ul>`;
                    this.el.innerHTML = customPaginationHtml;
                }

                this.addEvent(this.el.querySelector('.prev-page'),'click',function(e) {
                    var target = e.target ? e.target: e.srcElement;
                    var el = target.parentNode;
                    if (!el.hasAttribute("disabled")) {
                        _this.prevPage();
                    }
                })

                this.addEvent(this.el.querySelector('.next-page'),'click',function(e) {
                    var target = e.target ? e.target: e.srcElement;
                    var el = target.parentNode;
                    if (!el.hasAttribute("disabled")) {
                        _this.nextPage();
                    }
                })

                if (this.el.querySelector('.pageJumpPrev')) {
                    this.bindJumpPageMoreShow(this.el.querySelector('.pageJumpPrev'),'prev');
                    this.addEvent(this.el.querySelector('.pageJumpPrev'),'click',function() {
                        _this.prevJumpPage();
                    })
                }
                if (this.el.querySelector('.pageJumpNext')) {
                    this.bindJumpPageMoreShow(this.el.querySelector('.pageJumpNext'),'next');
                    this.addEvent(this.el.querySelector('.pageJumpNext'),'click',function() {
                        _this.nextJumpPage();
                    })
                }
                if (this.options.inputJumpPage) {
                    this.clickInputJump(this.el.querySelector('.go'));
                }
                if (this.options.selectPageSize) {
                    this.el.querySelector('.select-size').value = this.options.pageSize;
                    this.selectChangeSize(this.el.querySelector('.select-size'));
                }


                this.bindClickPage();
                this.disablePreNext();
            }else {
                var customPaginationHtml = "";
                customPaginationHtml = `<ul class="pageWrap">${prevHtml}<li><a class="current-page">1</a></li>${nextHtml}</ul>`;
                this.el.innerHTML = customPaginationHtml;
                var prev = this.el.querySelector(".prev-page");
                var next = this.el.querySelector('.next-page');

                prev.style.cssText = "cursor: not-allowed;color: #666666;color: #dcdcdc;background-color: #fafafa;";
                prev.setAttribute("disabled", true);
                next.style.cssText = "cursor: not-allowed;color: #666666;color: #dcdcdc;background-color: #fafafa;";
                next.setAttribute("disabled", true);
            }
        },
        addEvent: function(elem, type, fn) {
            if (elem.attachEvent) {
                elem.attachEvent("on" + type, fn);
                return
            }
            if (elem.addEventListener) {
                elem.addEventListener(type, fn, false)
            }
        },
        destroy: function() {
            // 清空容器
            this.el.innerHtml = "";
        }
    }


    if (typeof module !== "undefined" && module.exports) {
        module.exports = myPage
    }
    if (typeof define === "function") {
        define(function() {
            return myPage
        })
    }
    global.myPage = myPage
}(this))
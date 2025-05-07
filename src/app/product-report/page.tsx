Package: p.is_package ?? false,
          }))
        );
        
        // Fetch orders
        const ordersResponse = await ordersAPI.getAll("paid");
        setOrders(ordersResponse.data);

        // Fetch favorites data for popular products and category breakdown
        const params: {
          category?: string;
          start_date?: string;
          end_date?: string;
        } = {};
        if (dateRange?.from) {
          params.start_date = format(dateRange.from, "yyyy-MM-dd");
        }
        if (dateRange?.to) {
          params.end_date = format(dateRange.to, "yyyy-MM-dd");
        }

        try {
          const favorites = await ordersAPI.getFavorites(params);
          setFavoritesData(favorites);
        } catch (favError) {
          console.error("Error fetching favorites:", favError);
        }

        // For each order, fetch order details to get items
        const orderDetailsPromises = ordersResponse.data.map((order) =>
          ordersAPI.getById(order.id.toString()),
        );

        const orderDetailsResults =
          await Promise.allSettled(orderDetailsPromises);

        // Extract order items from successful responses
        const allOrderItems: OrderItem[] = [];
        orderDetailsResults.forEach((result) => {
          if (result.status === "fulfilled") {
            const detail = result.value as OrderDetail;
            if (detail.items) {
              allOrderItems.push(...detail.items);
            }
          }
        });

        setOrderItems(allOrderItems);
        setFilteredOrderItems(allOrderItems);
        setFilteredOrders(ordersResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load report data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="flex h-screen bg-background">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Product Report</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={isDateFilterActive ? "default" : "outline"}
                    size="sm"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {isDateFilterActive ? (
                      <span>
                        {dateRange?.from ? format(dateRange.from, "PPP") : ""} -{" "}
                        {dateRange?.to ? format(dateRange.to, "PPP") : ""}
                      </span>
                    ) : (
                      <span>Filter by Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={setDateRange}
                  />
                </PopoverContent>
              </Popover>
              {isDateFilterActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDateRange(undefined)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading report data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <PopularProducts
                    products={products}
                    orderItems={
                      isDateFilterActive ? filteredOrderItems : orderItems
                    }
                    favoritesData={favoritesData}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdown
                    products={products}
                    orderItems={
                      isDateFilterActive ? filteredOrderItems : orderItems
                    }
                    favoritesData={favoritesData}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time-Based Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeBasedAnalysis
                    orders={isDateFilterActive ? filteredOrders : orders}
                    orderItems={
                      isDateFilterActive ? filteredOrderItems : orderItems
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Range Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceRangeAnalysis
                    products={products}
                    orderItems={
                      isDateFilterActive ? filteredOrderItems : orderItems
                    }
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
